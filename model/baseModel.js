import { db } from "../config/firebase.config.js";

class BaseModel {
    constructor(collectionName) {
        this.collection = db.collection(collectionName);
    }

    async findById(id) {
        const snap = await this.collection.doc(id).get();
        if (!snap.exists) return null;
        return { id: snap.id, ...snap.data() };
    }

    async findAll() {
        const snap = await this.collection.get();
        return snap.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        }));
    }

    async create(data) {
        const ref = await this.collection.add(data);
        return ref.id;
    }

    async update(id, data) {
        await this.collection.doc(id).update(data);
    }

    async delete(id) {
        await this.collection.doc(id).delete();
    }

    async exists(id) {
        const snap = await this.collection.doc(id).get();
        return snap.exists;
    }
}

export default BaseModel;