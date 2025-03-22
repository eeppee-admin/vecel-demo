import Datastore from 'nedb';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化NeDB数据库
const db = new Datastore({
    filename: path.join(__dirname, '../data/users.db'),
    autoload: true,
    timestampData: true
});

// 创建唯一索引
db.ensureIndex({ fieldName: 'username', unique: true }, (err) => { });
db.ensureIndex({ fieldName: 'email', unique: true }, (err) => { });

class User {
    static create({ username, password, email }) {
        return new Promise(async (resolve, reject) => {
            try {
                const hash = await bcrypt.hash(password, 10);
                const user = {
                    username,
                    password_hash: hash,
                    email,
                    is_admin: false
                };

                db.insert(user, (err, newDoc) => {
                    err ? reject(err) : resolve(newDoc._id);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            db.findOne({ username }, (err, doc) => {
                if (err) return reject(err);
                resolve(doc);
            });
        });
    }

    static verify(password, hash) {
        return bcrypt.compare(password, hash);
    }

    static getAllUsers() {
        return new Promise((resolve, reject) => {
            db.find({}, (err, docs) => err ? reject(err) : resolve(docs));
        });
    }

    static deleteUser(id) {
        return new Promise((resolve, reject) => {
            db.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err || numRemoved === 0) reject(new Error('用户不存在'));
                else resolve();
            });
        });
    }
}

export default User;