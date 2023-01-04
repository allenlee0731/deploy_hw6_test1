import { Router } from "express";
import ScoreCard from "../models/ScoreCard";

const router = Router();

const saveUser = async (name,subject,score) => {
    const existing = await ScoreCard.findOne({ name,subject });
    if (existing) {
        existing.score=score;
        existing.save();
        return "Updating (";
        //throw new Error(`data ${name} exists!!`);
    }
    else {
        try {
            const newUser = new ScoreCard({ name,subject,score });
            console.log("Created user", newUser);
            newUser.save();
            return "Adding (";   
        } catch (e) { throw new Error("User creation error: " + e); }
    }
};

const deleteDB = async () => {
    try {
        await ScoreCard.deleteMany({});
        console.log("Database deleted");
    } catch (e) { throw new Error("Database deletion failed"); }
};

const queryUserName = async (name) => {
    const existing = await ScoreCard.find({ name });
    if (existing.length){
        console.log(existing);
    }
    else{
        console.log("not found");
    }
    return existing;
}

const queryUserSubject = async (subject) => {
    const existing = await ScoreCard.find({ subject });
    if (existing.length){
        console.log(existing);
    }
    else{
        console.log("not found");
    }
    return existing;
}

router.delete("/cards", (req,res)=>{
    deleteDB()
    res.json({message:"Database cleared"});
});

router.post("/card", async (req,res)=>{
    console.log(req.body);
    const name = req.body.name;
    const subject = req.body.subject;
    const score = req.body.score;
    const saveorupdate = await saveUser(name,subject,score);
    res.json({
        message:saveorupdate+name+","+subject+","+score.toString()+")",
        card:name+subject+score.toString()
    })
});

router.get("/cards", async (req,res)=>{
    const querytype=req.query.type;
    const queryString=req.query.queryString;
    if(querytype==='name'){
        const findObjArr = await queryUserName(queryString);
        if(findObjArr.length){
            const msgs = findObjArr.map((eachobj) => "Found card with name: ("+eachobj.name+","+eachobj.subject+","+eachobj.score.toString()+")");
            res.json({
                message:"Name ("+ queryString + ") not found!",
                messages:msgs
            })
        }
        else {
            res.json({
                message:"Name ("+ queryString + ") not found!",
            })
        }

    }
    else{
        const findObjArr = await queryUserSubject(queryString);
        if(findObjArr.length){
            const msgs = findObjArr.map((eachobj) => "Found card with subject: ("+eachobj.name+","+eachobj.subject+","+eachobj.score.toString()+")");
            res.json({
                message:"Subject ("+ queryString + ") not found!",
                messages:msgs
            })
        }
        else {
            res.json({
                message:"Subject ("+ queryString + ") not found!",
            })
        }
    }
    
});

export default router;