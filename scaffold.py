import os

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = r"d:\projects\Mini Project\Smart_home"

backend_files = {
    "backend/server.js": """const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/cleaning', require('./routes/cleaningRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
""",

    "backend/.env": """PORT=5000
MONGO_URI=mongodb://localhost:27017/smarthome
FIREBASE_SERVICE_ACCOUNT={}
""",

    "backend/config/db.js": """const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
""",

    "backend/config/firebase.js": """const admin = require('firebase-admin');

// Ensure you download your service account key and reference it here
// const serviceAccount = require('./path/to/serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

module.exports = admin;
""",

    "backend/middleware/authMiddleware.js": """const admin = require('../config/firebase');

const protect = async (req, res, next) => {
  // Mock authentication for easy local dev
  req.user = { uid: 'mock-user-123' };
  next();
  // In production, verify token
  /*
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
  */
};

module.exports = { protect };
""",

    "backend/models/User.js": """const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
""",

    "backend/models/Task.js": """const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  date: { type: Date, default: Date.now },
  userId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
""",

    "backend/models/Cleaning.js": """const mongoose = require('mongoose');

const cleaningSchema = mongoose.Schema({
  type: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  assignedUser: { type: String },
  status: { type: String, enum: ['scheduled', 'completed'], default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Cleaning', cleaningSchema);
""",

    "backend/models/Inventory.js": """const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  threshold: { type: Number, required: true, default: 1 }
}, { timestamps: true });

// Check low stock
inventorySchema.methods.isLowStock = function() {
  return this.quantity <= this.threshold;
};

module.exports = mongoose.model('Inventory', inventorySchema);
""",

    "backend/models/Expense.js": """const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  linkedInventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
""",

    "backend/models/Maintenance.js": """const mongoose = require('mongoose');

const maintenanceSchema = mongoose.Schema({
  deviceName: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
""",

    "backend/controllers/authController.js": """const User = require('../models/User');

exports.registerUser = async (req, res) => {
  const { uid, email, name } = req.body;
  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({ uid, email, name });
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
""",

    "backend/controllers/taskController.js": """const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
""",

    "backend/controllers/cleaningController.js": """const Cleaning = require('../models/Cleaning');

exports.getCleaningTasks = async (req, res) => {
  try {
    const schedules = await Cleaning.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCleaningTask = async (req, res) => {
  try {
    const schedule = await Cleaning.create(req.body);
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCleaningTask = async (req, res) => {
  try {
    const schedule = await Cleaning.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCleaningTask = async (req, res) => {
  try {
    await Cleaning.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cleaning schedule deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
""",

    "backend/controllers/inventoryController.js": """const Inventory = require('../models/Inventory');
const Expense = require('../models/Expense');

exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    // Check if quantity decreased to auto-generate expense
    const oldItem = await Inventory.findById(req.params.id);
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (oldItem.quantity > item.quantity) {
      const usedAmount = oldItem.quantity - item.quantity;
      // create automatic expense entry (mock cost per item as $10 for example)
      await Expense.create({
        amount: usedAmount * 10,
        category: 'Inventory Usage',
        linkedInventoryItem: item._id
      });
    }

    if (item.isLowStock()) {
      // Trigger low stock alert here
      console.log(`Alert: ${item.itemName} is running low!`);
    }

    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
""",

    "backend/controllers/expenseController.js": """const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('linkedInventoryItem', 'itemName');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
""",

    "backend/controllers/maintenanceController.js": """const Maintenance = require('../models/Maintenance');

exports.getMaintenance = async (req, res) => {
  try {
    const items = await Maintenance.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMaintenanceItem = async (req, res) => {
  try {
    const item = await Maintenance.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateMaintenanceItem = async (req, res) => {
  try {
    const item = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMaintenanceItem = async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Maintenance record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
""",

    "backend/routes/authRoutes.js": """const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

router.post('/register', registerUser);

module.exports = router;
""",

    "backend/routes/taskRoutes.js": """const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
""",

    "backend/routes/cleaningRoutes.js": """const express = require('express');
const router = express.Router();
const { getCleaningTasks, createCleaningTask, updateCleaningTask, deleteCleaningTask } = require('../controllers/cleaningController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCleaningTasks).post(protect, createCleaningTask);
router.route('/:id').put(protect, updateCleaningTask).delete(protect, deleteCleaningTask);

module.exports = router;
""",

    "backend/routes/inventoryRoutes.js": """const express = require('express');
const router = express.Router();
const { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getInventory).post(protect, addInventoryItem);
router.route('/:id').put(protect, updateInventoryItem).delete(protect, deleteInventoryItem);

module.exports = router;
""",

    "backend/routes/expenseRoutes.js": """const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getExpenses).post(protect, addExpense);
router.route('/:id').delete(protect, deleteExpense);

module.exports = router;
""",

    "backend/routes/maintenanceRoutes.js": """const express = require('express');
const router = express.Router();
const { getMaintenance, addMaintenanceItem, updateMaintenanceItem, deleteMaintenanceItem } = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMaintenance).post(protect, addMaintenanceItem);
router.route('/:id').put(protect, updateMaintenanceItem).delete(protect, deleteMaintenanceItem);

module.exports = router;
"""
}

ai_files = {
    "ai-service/requirements.txt": """fastapi
uvicorn
tensorflow
pydantic
""",
    
    "ai-service/main.py": """from fastapi import FastAPI
from routes import predict

app = FastAPI(title="Smart Home AI Service")

app.include_router(predict.router)

@app.get("/")
def read_root():
    return {"message": "AI Service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
""",

    "ai-service/routes/predict.py": """from fastapi import APIRouter
from pydantic import BaseModel
from services.recommendation import suggest_tasks, predict_low_inventory

router = APIRouter()

class UsageData(BaseModel):
    items: list

@router.post("/suggest-tasks")
def suggest(data: UsageData):
    tasks = suggest_tasks(data.items)
    return {"suggested_tasks": tasks}

@router.post("/predict-inventory")
def predict_inventory(data: UsageData):
    predictions = predict_low_inventory(data.items)
    return {"low_inventory_predictions": predictions}
""",

    "ai-service/services/recommendation.py": """def suggest_tasks(usage_data):
    # Dummy logic. Replace with TF model inference.
    if len(usage_data) > 3:
        return ["Clean up room", "Restock frequently used items"]
    return ["General maintenance"]

def predict_low_inventory(usage_data):
    # Dummy logic. Replace with TF model inference.
    return ["Milk", "Soap"]
""",

    "ai-service/models/README.md": """# ML Models
Place your `model.h5` and other model assets here.
"""
}

frontend_files = {
    "frontend/package.json": """{
  "name": "smart-home-frontend",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "@react-navigation/stack": "^6.3.17",
    "axios": "^1.4.0",
    "expo": "~49.0.8",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "react-native-safe-area-context": "4.6.3",
    "react-native-screens": "~3.22.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}""",

    "frontend/App.js": """import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
""",

    "frontend/navigation/AppNavigator.js": """import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TaskAndCleaning from '../screens/TaskAndCleaning';
import InventoryExpense from '../screens/InventoryExpense';
import MaintenanceScreen from '../screens/MaintenanceScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks & Cleaning" component={TaskAndCleaning} />
      <Tab.Screen name="Inventory & Expense" component={InventoryExpense} />
      <Tab.Screen name="Maintenance" component={MaintenanceScreen} />
    </Tab.Navigator>
  );
}
""",

    "frontend/screens/HomeScreen.js": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back, User!</Text>
      <Text>Your Smart Home is running perfectly.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' }
});
""",

    "frontend/screens/TaskAndCleaning.js": """import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import TaskCard from '../components/TaskCard';
import cleaningService from '../services/cleaningService';
import taskService from '../services/taskService';

export default function TaskAndCleaning() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    // Mock load
    setTasks([
      { id: '1', type: 'Task', title: 'Buy groceries', status: 'pending' },
      { id: '2', type: 'Cleaning', title: 'Vacuum Living Room', status: 'scheduled' }
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks & Cleaning Schedule</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 }
});
""",

    "frontend/screens/InventoryExpense.js": """import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import InventoryItem from '../components/InventoryItem';
import ExpenseSummary from '../components/ExpenseSummary';

export default function InventoryExpense() {
  const [inventory, setInventory] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    setInventory([
      { id: '1', itemName: 'Milk', quantity: 2, threshold: 1 }
    ]);
    setExpenses([
      { id: '1', category: 'Groceries', amount: 15 }
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory</Text>
      <FlatList
        data={inventory}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <InventoryItem item={item} />}
      />
      
      <Text style={[styles.header, {marginTop: 20}]}>Recent Expenses</Text>
      <ExpenseSummary expenses={expenses} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold' }
});
""",

    "frontend/screens/MaintenanceScreen.js": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaintenanceCard from '../components/MaintenanceCard';

export default function MaintenanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Maintenance Schedule</Text>
      <MaintenanceCard item={{ deviceName: 'AC Filter', dueDate: '2023-11-01', status: 'pending' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 }
});
""",

    "frontend/screens/LoginScreen.js": """import React from 'react';
import { View, Text } from 'react-native';

export default function LoginScreen() {
  return (
    <View><Text>Login Screen</Text></View>
  );
}
""",

    "frontend/screens/RegisterScreen.js": """import React from 'react';
import { View, Text } from 'react-native';

export default function RegisterScreen() {
  return (
    <View><Text>Register Screen</Text></View>
  );
}
""",

    "frontend/components/TaskCard.js": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TaskCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>[{item.type}] {item.title}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#f9f9f9', marginBottom: 8, borderRadius: 8 },
  title: { fontWeight: 'bold' }
});
""",

    "frontend/components/CleaningCard.js": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CleaningCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.type}</Text>
      <Text>Scheduled: {item.scheduledDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#e9e9e9', marginBottom: 8, borderRadius: 8 },
  title: { fontWeight: 'bold' }
});
""",

    "frontend/components/InventoryItem.js": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InventoryItem({ item }) {
  return (
    <View style={styles.card}>
        <Text style={styles.title}>{item.itemName}</Text>
        <Text>Qty: {item.quantity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fff', marginBottom: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  title: { fontWeight: 'bold' }
});
""",

    "frontend/components/ExpenseSummary.js": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Total Expenses: ${total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fee', borderRadius: 8 },
  title: { fontWeight: 'bold', color: 'red' }
});
""",

    "frontend/components/MaintenanceCard.js": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MaintenanceCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.deviceName}</Text>
      <Text>Due: {item.dueDate}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#eef', marginBottom: 8, borderRadius: 8 },
  title: { fontWeight: 'bold' }
});
""",

    "frontend/services/api.js": """import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add interceptor for token if implemented
export default api;
""",

    "frontend/services/taskService.js": """import api from './api';

const getTasks = () => api.get('/tasks');
const createTask = (task) => api.post('/tasks', task);

export default { getTasks, createTask };
""",

    "frontend/services/cleaningService.js": """import api from './api';

const getCleanings = () => api.get('/cleaning');
const createCleaning = (cleaning) => api.post('/cleaning', cleaning);

export default { getCleanings, createCleaning };
""",

    "frontend/services/inventoryService.js": """import api from './api';

const getInventory = () => api.get('/inventory');
const addInventory = (item) => api.post('/inventory', item);

export default { getInventory, addInventory };
""",

    "frontend/services/expenseService.js": """import api from './api';

const getExpenses = () => api.get('/expenses');
const addExpense = (expense) => api.post('/expenses', expense);

export default { getExpenses, addExpense };
"""
}

# Run generation
all_files = {**backend_files, **ai_files, **frontend_files}

for rel_path, content in all_files.items():
    full_path = os.path.join(base_dir, rel_path)
    create_file(full_path, content)

print("Scaffolding complete!")
