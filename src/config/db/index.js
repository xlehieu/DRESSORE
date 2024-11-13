import mongoose from 'mongoose';

const uriCompass = 'mongodb://localhost:27017/Dressore';
export async function connect() {
    const uriConnect =
        'mongodb+srv://xlehieu:WLi54Gehhlb7JgSX@cluster0.hp85a.mongodb.net/dressore?retryWrites=true&w=majority&appName=Cluster0';
    try {
        await mongoose.connect(uriConnect);
        console.log('Connect cluster successful');
    } catch {
        await mongoose.connect(uriCompass);
        console.log('Connect compass successful');
        try {
        } catch (err) {
            console.log(err);
        }
    }
}
//1zcgSQEATiygQmPD
