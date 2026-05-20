import { supabase } from '../lib/supabase.js';
import { AppError } from '../errors/appError.js';

const BUCKET = 'Centauri-books';

export const uploadImage = async (file, folder = 'products') => {
    const ext = file.mimetype.split('/')[1];
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) throw new AppError(`Error al subir la imagen: ${error.message}`, 500);

    const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

    return data.publicUrl;
};

export const deleteImage = async (filePath) => {

    if (!filePath) throw new AppError('URL de imagen inválida', 400);

    const { error } = await supabase.storage
        .from(BUCKET)
        .remove([filePath]);

    if (error) throw new AppError(`Error al eliminar la imagen: ${error.message}`, 500);
};