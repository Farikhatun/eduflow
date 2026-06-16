// Data Management with Firebase
class DataManager {
    constructor() {
        this.collection = 'learning_data';
        this.data = [];
        this.listeners = [];
    }

    async init() {
        try {
            // Subscribe to real-time updates
            db.collection(this.collection)
                .orderBy('created_at', 'desc')
                .onSnapshot((snapshot) => {
                    this.data = [];
                    snapshot.forEach((doc) => {
                        this.data.push({
                            __backendId: doc.id,
                            ...doc.data()
                        });
                    });
                    this.notifyListeners();
                });
            return { isOk: true };
        } catch (error) {
            console.error('Data init error:', error);
            return { isOk: false, error: error.message };
        }
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.data));
    }

    async create(data) {
        try {
            data.created_at = new Date().toISOString();
            const docRef = await db.collection(this.collection).add(data);
            return { isOk: true, id: docRef.id };
        } catch (error) {
            console.error('Create error:', error);
            return { isOk: false, error: error.message };
        }
    }

    async update(id, data) {
        try {
            data.updated_at = new Date().toISOString();
            await db.collection(this.collection).doc(id).update(data);
            return { isOk: true };
        } catch (error) {
            console.error('Update error:', error);
            return { isOk: false, error: error.message };
        }
    }

    async delete(id) {
        try {
            await db.collection(this.collection).doc(id).delete();
            return { isOk: true };
        } catch (error) {
            console.error('Delete error:', error);
            return { isOk: false, error: error.message };
        }
    }

    getData() {
        return this.data;
    }

    getByType(type) {
        return this.data.filter(item => item.type === type);
    }

    getById(id) {
        return this.data.find(item => item.__backendId === id);
    }
}

// Create instance
const dataManager = new DataManager();
window.dataManager = dataManager;