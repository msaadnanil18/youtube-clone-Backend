import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    video: {
      type: Schema.ObjectId,
      ref: 'Video',
    },
    owner: {
      type: Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

commentSchema.plugin(mongooseAggregatePaginate)

export const Comments = mongoose.model('Comment', commentSchema);
