import mongoose from 'mongoose';
import mongooseSlugGenerator from 'mongoose-slug-generator';
import MongooseDelete from 'mongoose-delete';

const Schema = mongoose.Schema;

const PromotionalEventSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        percentDiscount: { type: Number, required: true },
        isActive: { type: Boolean, required: true },
        thumb: { type: String, required: true },
        slug: { type: String, slug: 'title', required: true },
    },
    { timestamps: true },
);

mongoose.plugin(mongooseSlugGenerator);
PromotionalEventSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});

const PromotionalEvent = mongoose.model('promotional_event', PromotionalEventSchema);

export default PromotionalEvent;
