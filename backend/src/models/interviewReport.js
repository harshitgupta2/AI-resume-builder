import mongoose from 'mongoose'



// these are the sub schema to have more readability
 const techinalQuestionsSchema = new mongoose.Schema({
    questions:{
        type:String,
        required:[true,"Technical Questions are Required"]

    },
    intention:{
        type:String,
        required:[true,"Intention is required"],

    },
    answer:{
        type:String,
        required:[true,"Answer required"],

    }

 },{_id:false})
 const behaviouralQuestionsSchema = new mongoose.Schema({
       questions:{
        type:String,
        required:[true,"Technical Questions are Required"]

    },
    intention:{
        type:String,
        required:[true,"Intention is required"],

    },
    answer:{
        type:String,
        required:[true,"Answer required"],

    }
 },{ _id:false})

 const skillGapSchema = new mongoose.Schema({
    skill:{
    type:String,
    required:[true,"Skills are Required"],
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"Severity is Required"]
    },

 },{_id:false })

 const preparationPlanSchema = new mongoose.Schema({
    days:{
        type:Number,
        required:[true,"Days are required"]
    },
    focus:{
        type:String,
        required:[true,"Focus is required"]
    },
    tasks:[{
        type:String,
        required:[true,"Task is required"]
    }]
 })


 // actual main schema 
 const interviewReportSchema = new mongoose.Schema({

    jobDescription:{
        type:String,
        required:[true,"Job Description is required"]
    },
    resume:{
        type:String
    },
    selfDescription:{
        type:String,

    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    techinalQuestions:[techinalQuestionsSchema],
    behaviouralQuestions:[behaviouralQuestionsSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        
    }
 },{
    timestamps:true
 })

 const interviewReportModel = new mongoose.model("interviewReport",interviewReportSchema)

 export default interviewReportModel;