import mongoose from 'mongoose';
import mongooseSlugGenerator from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: '{PATH} is required',
        },
        thumb: {
            type: String,
        },
        isInMenu: {
            type: Boolean,
        },
        isShow: {
            type: Boolean,
        },
        description: {
            type: String,
        },
        slug: {
            type: String,
            slug: 'name',
        },
        products: [{ type: Schema.Types.ObjectId, ref: 'product' }],
    },
    { timestamps: true },
);
mongoose.plugin(mongooseSlugGenerator);
CategorySchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});
const Category = mongoose.model('category', CategorySchema);

export default Category;
