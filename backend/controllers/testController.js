import Test from "../models/Test.js";

// ➕ Create new test
export const createTest = async (req, res) => {
  try {
    const newTest = await Test.create(req.body);
    res.status(201).json({ message: "Test created successfully", newTest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get all tests
export const getTests = async (req, res) => {
  try {
    const tests = await Test.find().populate("questions");
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧩 Get categorized tests (Available / Scheduled)
export const getCategorizedTests = async (req, res) => {
  try {
    const tests = await Test.find();

    const now = new Date();

    // Available tests (no scheduling)
    const availableTests = tests.filter(
      (test) => !test.scheduledFrom && !test.scheduledTo
    );

    // Scheduled tests (with valid future or current date range)
    const scheduledTests = tests.filter((test) => {
      if (!test.scheduledFrom || !test.scheduledTo) return false;
      const start = new Date(test.scheduledFrom);
      const end = new Date(test.scheduledTo);
      return end > now; // show only those not expired
    });

    res.json({ availableTests, scheduledTests });
  } catch (error) {
    console.error("Error fetching categorized tests:", error);
    res.status(500).json({ error: "Server error while fetching tests" });
  }
};
 

// Update test
export const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Test.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating test" });
  }
};



// 🗑️ Delete test
export const deleteTest = async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
