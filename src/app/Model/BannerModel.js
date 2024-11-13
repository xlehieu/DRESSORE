import mongoose from 'mongoose';
import mongooseSlugGenerator from 'mongoose-slug-generator';
import MongooseDelete from 'mongoose-delete';

const Schema = mongoose.Schema;

const BannerSchema = new Schema(
    {
        name: { type: String, required: true },
        thumb: { type: String, required: true },
        isShowHome: { type: Boolean, required: true },
        slug: { type: String, slug: 'name' },
    },
    { timestamps: true },
);
mongoose.plugin(mongooseSlugGenerator);
BannerSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});

const Banner = mongoose.model('banner', BannerSchema);
export default Banner;
