import { ErrorsEnum } from 'enums/ErrorsEnum';
import { StatusCodeEnum } from 'enums/StatusCodeEnum';
import { RequestHandler } from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';

export function wrapUpload(uploadMw: RequestHandler): RequestHandler {
    return (req, res, next) => {
        uploadMw(req, res, async (err: any) => {
            if (!err) return next();

            // Best-effort cleanup if files were already written to disk.
            const files = (req.files as Express.Multer.File[]) || [];
            await Promise.allSettled(files.map(f => fs.unlink(f.path)));

            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(StatusCodeEnum.PayloadTooLarge).send({
                        error: ErrorsEnum.FileTooLarge,
                    });
                }

                // LIMIT_FILE_COUNT, LIMIT_UNEXPECTED_FILE, etc.
                return res.status(StatusCodeEnum.BadRequest).send({
                    error: ErrorsEnum.InvalidData,
                });
            }

            return res.status(StatusCodeEnum.InternalServerError).send({
                error: ErrorsEnum.InternalServerError,
            });
        });
    };
}
