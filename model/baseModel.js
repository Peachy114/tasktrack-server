import { db } from "../config/firebase.config.js";

class BaseModel {
    constructor(collectionName) {
        this.collection = db.collection(collectionName);
        this.db = db;
    }

    async findById(id) {
    const snap = await this.collection.doc(id).get();
        if (!snap.exists) return null;
        const d = { id: snap.id, ...snap.data() }
        if (d.createdAt?.toDate) d.createdAt = d.createdAt.toDate().toISOString()
        if (d.updatedAt?.toDate) d.updatedAt = d.updatedAt.toDate().toISOString()
        return d
    }

    async findAll() {
    const snap = await this.collection.get();
    return snap.docs.map(doc => {
        const d = { id: doc.id, ...doc.data() }
        if (d.createdAt?.toDate) d.createdAt = d.createdAt.toDate().toISOString()
        if (d.updatedAt?.toDate) d.updatedAt = d.updatedAt.toDate().toISOString()
        return d
    });
}

    async create(data) {
        const ref = await this.collection.add(data);
        return { id: ref.id, ...data };
    }

    async createWithId(id, data) {
        await this.collection.doc(id).set(data);
        return { id, ...data };
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