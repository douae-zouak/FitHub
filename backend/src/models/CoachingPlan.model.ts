import mongoose, { Document, Schema } from 'mongoose';

interface IWorkout {
    day: string;
    exercises: {
        name: string;
        sets: number;
        reps: string;
        notes?: string;
    }[];
}

export interface ICoachingPlan extends Document {
    user: mongoose.Types.ObjectId;
    planType: 'basic' | 'pro' | 'elite';
    goals: string[];
    workouts: IWorkout[];
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
        meals: string[];
    };
    progress: {
        date: Date;
        weight?: number;
        measurements?: Record<string, number>;
        notes?: string;
    }[];
    assignedCoach?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CoachingPlanSchema = new Schema<ICoachingPlan>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        planType: {
            type: String,
            enum: ['basic', 'pro', 'elite'],
            required: true
        },
        goals: {
            type: [String],
            default: []
        },
        workouts: [
            {
                day: String,
                exercises: [
                    {
                        name: String,
                        sets: Number,
                        reps: String,
                        notes: String
                    }
                ]
            }
        ],
        nutrition: {
            calories: Number,
            protein: Number,
            carbs: Number,
            fats: Number,
            meals: [String]
        },
        progress: [
            {
                date: { type: Date, default: Date.now },
                weight: Number,
                measurements: Schema.Types.Mixed,
                notes: String
            }
        ],
        assignedCoach: String
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ICoachingPlan>('CoachingPlan', CoachingPlanSchema);
