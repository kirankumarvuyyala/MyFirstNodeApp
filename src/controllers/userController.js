// src/controllers/adminController.js

// Mock data for demonstration
let admins = [
    { id: 1, name: 'Admin One' },
    { id: 2, name: 'Admin Two' }
];

// Get all admins
exports.getAllAdmins = (req, res) => {
    res.json(admins);
};

// Get a single admin by ID
exports.getAdminById = (req, res) => {
    const adminId = parseInt(req.params.id, 10);
    const admin = admins.find(a => a.id === adminId);

    if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
};

// Create a new admin
exports.createAdmin = (req, res) => {
    const newAdmin = {
        id: admins.length + 1,
        name: req.body.name
    };
    admins.push(newAdmin);
    res.status(201).json(newAdmin);
};

// Update an existing admin
exports.updateAdmin = (req, res) => {
    const adminId = parseInt(req.params.id, 10);
    const admin = admins.find(a => a.id === adminId);

    if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
    }

    admin.name = req.body.name;
    res.json(admin);
};

// Delete an admin
exports.deleteAdmin = (req, res) => {
    const adminId = parseInt(req.params.id, 10);
    admins = admins.filter(a => a.id !== adminId);
    res.status(204).send(); // No content
};
