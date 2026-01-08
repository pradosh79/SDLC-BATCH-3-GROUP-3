const Progress = require("../../model/progressModel");

class ProgressApiModel{

    async getUserProgress(req, res){
            try{
                const data = await Progress.find({ user: req.user._id }).populate("lesson");
                res.json(data);
            }catch(error){
                console.log('error', error.message);
                return res.status(500).json({ message: "Internal server error" });
            }
    }

    async updateProgress(req, res){
        try{
             const { lessonId, score } = req.body;

            await Progress.findOneAndUpdate(
                { user: req.user._id, lesson: lessonId },
                { score, completed: true },
                { upsert: true }
            );
            res.json({ message: "Progress updated" });
        }catch(error){
                console.log('error', error.message);
                return res.status(500).json({ message: "Internal server error" });
        }
    }

}

module.exports = new ProgressApiModel();