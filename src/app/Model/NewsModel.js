import mongoose from 'mongoose';
import mongooseSlugGenerator from 'mongoose-slug-generator';
import MongooseDelete from 'mongoose-delete';
const Schema = mongoose.Schema;
const NewsSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        shortContent: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        thumb: {
            type: String,
        },
        slug: {
            type: String,
            slug: 'title',
        },
    },
    { timestamps: true },
);
mongoose.plugin(mongooseSlugGenerator);
NewsSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});
const News = mongoose.model('new', NewsSchema);
export default News;
