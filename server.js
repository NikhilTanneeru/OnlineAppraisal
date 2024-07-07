const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require('multer');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -----------------------------------------------------------------------------------

//Schemas

const { Schema } = mongoose;

const fileSchema = new Schema({
  filename: String,
  filepath: String
});

const workshopSchema = new Schema({
  duration: String,
  files: [fileSchema], // Array of fileSchema for multiple files
  poster: fileSchema // Single fileSchema for the poster
});

const scholarSchema = new Schema({
  name: String,
  scholarId: String,
});

const researchSchema = new Schema({
  conducted: String,
  title: String,
  startDate: Date,
  expectedEndDate: Date,
  numScholars: Number,
  scholars: [scholarSchema],
  reportFile: {
    filename: String,
    filepath: String,
  },
  status: {
    type: String,
    default: "Pending"
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empId:String,
  empName:String
});


const trainingSchema = new Schema({
  conducted: String,
  fromDate: Date,
  toDate: Date,
  duration: Number,
  title: String,
  noOfDays: Number,
  certificate: fileSchema,
  status: {
    type: String,
    default: "Pending"
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empId:String,
  empName:String
});


const hackathonSchema = new Schema({
  conducted: String,
  title: String,
  fromDate: Date,
  toDate: Date,
  fromTime: String,
  toTime: String,
  topic: String,
  report: fileSchema,
  poster: fileSchema,
  status: {
    type: String,
    default: "Pending"
  },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empId:String,
  empName:String,
  cordName: String,
  coordId:String
});

const extraClassSchema = new Schema({
  conducted: String,
  date: Date,
  fromTime: String,
  toTime: String,
  title: String,
  status: {
    type: String,
    default: "Pending"
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empId:String,
  empName:String
});

const expertLecturesSchema= new Schema({
  conducted: String,
  title: String,
  instructor: String,
  report: fileSchema,
  poster: fileSchema,  
  status: {
    type: String,
    default: "Pending"
  },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empId:String,
  empName:String,
  cordName: String,
  coordId:String
});

const MOOCSchema = new Schema({
  conducted: String,
  details: fileSchema,
  status: {
    type: String,
    default: "Pending"
  },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empId:String,
  empName:String,
  cordName: String,
  coordId:String
});

const valAddSchema = new Schema({
  conducted: String,
  courseName: String,
  hoursRequired: Number,
  credits: Number,
  description: String,
  syllabus: fileSchema,
  status: {
    type: String,
    default: "Pending"
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empId:String,
  empName:String
  
});

const publicationSchema = new Schema({
  consucted:String,
  title: String,
  publicationID: String,
  publicationURL: String,
  description: String,
  publicationFile: fileSchema, 
  status: {
    type: String,
    default: "Pending"
  },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empId:String,
  empName:String,
  cordName: String,
  coordId:String
});

const industrialVisitSchema = new Schema({
  consucted:String,
  placeOfVisit: String,
  mediumOfTransport: String,
  costOfTransport: Number,
  additionalCharges: Number,
  bills: [fileSchema],
  status: {
    type: String,
    default: "Pending"
  },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  empId:String,
  empName:String,
  cordName: String,
  coordId:String
});


const pointsLogSchema = new Schema({
  activityType: String, // e.g., Workshop, Hackathon, etc.
  title: String,
  fromDate: Date,
  toDate: Date,
  pointsEarned: Number
});

const userSchema = new Schema({
  title: String,
  firstName: String,
  lastName: String,
  school: String,
  employeeId: String,
  designation: String,
  facultyType: String,
  engType: String,
  joiningDate: Date,
  dob: Date,
  email: String,
  officeNumber: String,
  personalNumber: String,
  password: String,
  isTrainingCompleted: { type: Boolean, default: false },
  workshops: [workshopSchema], 
  researches: [researchSchema],
  hackathons: [hackathonSchema], 
  extraClasses: [extraClassSchema], 
  expertLectures: [expertLecturesSchema],
  MOOC: [MOOCSchema],
  valAddCourses: [valAddSchema],
  publications: [publicationSchema], 
  industrialVisits: [industrialVisitSchema],
  trainings: [trainingSchema], 
  totalPoints: { type: Number, default: 0 }, 
  pointsLog: [pointsLogSchema] 
});


const User = mongoose.model('User', userSchema, 'react');

// ---------------------------------------------------------------------------------------------------------------------------------------------------------


// Storage and Upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'application/pdf') {
  cb(null, true);
  } else {
  cb(new Error('Only JPEG files are allowed'), false);
  }
  },
  });

  // -------------------------------------------------------------------------------------------------------------------------------------------------------

// File filters
const workshopFileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG files are allowed for workshops'), false);
  }
};

const researchFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF or DOCX files are allowed for research'), false);
  }
};

const imgDocFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOCX, JPEG, and JPG files are allowed'), false);
  }
};


// Multer instances
const uploadWorkshopFiles = multer({ 
  storage: storage,
  fileFilter: workshopFileFilter,
});

const uploadResearchFiles = multer({ 
  storage: storage,
  fileFilter: researchFileFilter,
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// mongoose.connect('mongodb://127.0.0.1:27017/appraisal', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb://127.0.0.1:27017/appraisal')
  .then(() => console.log('Connected to MongoDB .........'))
  .catch(err => console.error('MongoDB connection error:', err));



const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// app.post('/signup', async (req, res) => {
//   try {
//     // const salt = await bcrypt.genSalt(10);
//     const userData = req.body;
//     // const hashedPassword = await bcrypt.hash(userData.password, salt);
//     const user = new User({ ...userData, password: hashedPassword });
//     await user.save();
//     const token = generateToken(user);
//     res.send({ message: 'User created successfully', token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: 'Error creating user' });
//   }
// });

app.post('/signup', async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt(10);
    const userData = req.body;
    // const hashedPassword = await bcrypt.hash(userData.password, salt);
    const user = new User({  ...userData});
    await user.save();
    const token = generateToken(user);
    res.send({ message: 'User created successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating user' });
  }
});

app.post('/login', async (req, res) => {
  const { employeeId, password } = req.body;
  try {
    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: 'Invalid password' });
    }
    const token = generateToken(user);
    res.send({ message: 'Login successful', token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.post('/create-password', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ message: 'Password updated successfully', user });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.post('/get-user', authenticateToken, async (req, res) => {
  const { employeeId } = req.body;
  try {
    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.post('/update-user-info', authenticateToken, upload.single('file'), async (req, res) => {
  const { file, body } = req;
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndUpdate(userId, {
      $set: {
        additionalInfo: body,
        file: file.originalname,
      },
    }, { new: true });
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating user info' });
  }
});



app.get('/get-user-points', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId, 'totalPoints pointsLog');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ totalPoints: user.totalPoints, pointsLog: user.pointsLog });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching user points data' });
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/upload-training-details', authenticateToken, upload.single('certificate'), async (req, res) => {
  const userId = req.user.id;
  const { fromDate, toDate, duration,noOfDays, title } = req.body;
  const certificate = req.file;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const certificateDetails = certificate ? {
      filename: certificate.originalname,
      filepath: certificate.path
    } : null;

    const newTraining = {
      conducted: 'Training',
      fromDate,
      toDate,
      duration,
      title,
      noOfDays,
      certificate: certificateDetails,
      status: 'Pending',
      userId: user._id,
      empId: user.employeeId,
      empName: user.firstName+' '+user.lastName
    };

    if (!Array.isArray(user.trainings)) {
      user.trainings = [];
    }

    user.trainings.push(newTraining);

    await user.save();

    res.send({ message: 'Training details uploaded successfully', trainingId: newTraining._id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading training details' });
  }
});



app.get('/get-training-status', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId, 'trainings isTrainingCompleted');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ 
      isTrainingCompleted: user.isTrainingCompleted,
      trainings: user.trainings
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving training status' });
  }
});



// Workshop

app.post('/upload-workshop-files', authenticateToken, uploadWorkshopFiles.fields([{ name: 'files', maxCount: 12 }, { name: 'poster', maxCount: 1 }]), async (req, res) => {
  const userId = req.user.id;
  const files = req.files.files || [];
  const poster = req.files.poster ? req.files.poster[0] : null;
  const { duration } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const workshopFiles = files.map((file) => ({
      filename: file.originalname,
      filepath: file.path
    }));

    const workshopPoster = poster ? {
      filename: poster.originalname,
      filepath: poster.path
    } : null;

    const newWorkshop = {
      duration,
      files: workshopFiles,
      poster: workshopPoster
    };

    user.workshops.push(newWorkshop);

    await user.save();
    res.send({ message: 'Files uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading files' });
  }
});


app.get('/get-workshop-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Ensure workshops is an array
    const count = user.workshops ? user.workshops.length : 0;
    res.send({ count });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching workshop count' });
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// Research upload route
app.post('/upload-research-details', authenticateToken, uploadResearchFiles.single('reportFile'), async (req, res) => {
  const userId = req.user.id;
  const { title, startDate, expectedEndDate, scholars } = req.body;
  const reportFile = req.file;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const newResearch = {
      title,
      startDate,
      expectedEndDate,
      scholars: JSON.parse(scholars),
      reportFile: {
        filename: reportFile.originalname,
        filepath: reportFile.path,
      },
    };

    user.researches.push(newResearch);

    await user.save();
    res.send({ message: 'Research details uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading research details' });
  }
});




app.get('/get-research-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const count = user.researches ? user.researches.length : 0;
    res.send({ count });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching research count' });
  }
});


app.post('/submit-research', authenticateToken, upload.single('reportFile'), async (req, res) => {
  const userId = req.user.id;
  const { title, startDate, expectedEndDate, numScholars, scholars } = req.body;
  const reportFile = req.file;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const newResearch = {
      conducted:'Research',
      title,
      startDate,
      expectedEndDate,
      numScholars: parseInt(numScholars),
      scholars: JSON.parse(scholars),
      reportFile: {
        filename: reportFile.originalname,
        filepath: reportFile.path,
      },
      status: 'Pending',
      userId: user._id,
      empId: user.employeeId,
      empName: user.firstName+' '+user.lastName
    };

    
    if (!Array.isArray(user.researches)) {
      user.researches = [];
    }

    user.researches.push(newResearch);

    await user.save();
    res.send({ message: 'Research submitted successfully' , researchid: newResearch._id});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error submitting research' });
  }
});


app.get('/get-researches', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ researches: user.researches });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching researches' });
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// Hackathon upload route
app.post('/upload-hackathon-details', authenticateToken, uploadResearchFiles.fields([{ name: 'poster' }, { name: 'report' }]), async (req, res) => {
  const userId = req.user.id; // Ensure this is the correct way to get user ID from your auth middleware
  const { fromDate, toDate, fromTime, toTime, title, hasCoordinator, coordinatorId } = req.body;
  const report = req.files.report ? req.files.report[0] : null;
  const poster = req.files.poster ? req.files.poster[0] : null;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    let coordinator = null;
    if (hasCoordinator && coordinatorId) {
      coordinator = await User.findOne({ employeeId: coordinatorId });
      if (!coordinator) {
        return res.status(404).send({ message: 'Coordinator not found' });
      }
    }

    const hackathonReport = report ? {
      filename: report.originalname,
      filepath: report.path
    } : null;

    const hackathonPoster = poster ? {
      filename: poster.originalname,
      filepath: poster.path
    } : null;

    const newHackathon = {
      conducted:'Hackathon',
      title,
      fromDate,
      toDate,
      fromTime,
      toTime,
      poster: hackathonPoster,
      report: hackathonReport,
      coordinatorId: coordinator ? coordinator._id : null,
      userId: user._id,
      status: 'Pending',
      empId: user.employeeId,
      empName: user.firstName+' '+user.lastName,
      cordName: coordinator ? `${coordinator.firstName} ${coordinator.lastName}` : '',
      coordId: coordinator ? coordinator.employeeId : ''
    };

    if (!Array.isArray(user.hackathons)) {
      user.hackathons = [];
    }

    user.hackathons.push(newHackathon);

    await user.save();

    res.send({ message: 'Hackathon details uploaded successfully', hackathonId: newHackathon._id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading hackathon details' });
  }
});


// ----------------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/upload-expertlecture-details', authenticateToken, upload.fields([{ name: 'poster' }, { name: 'report' }]), async (req, res) => {
  const userId = req.user.id; // Ensure this is the correct way to get user ID from your auth middleware
  const report = req.files.report ? req.files.report[0] : null;
  const poster = req.files.poster ? req.files.poster[0] : null;
  const { title, instructor, hasCoordinator, coordinatorId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    let coordinator = null;
    if (hasCoordinator && coordinatorId) {
      coordinator = await User.findOne({ employeeId: coordinatorId });
      if (!coordinator) {
        return res.status(404).send({ message: 'Coordinator not found' });
      }
    }

    const lectureReport = report ? {
      filename: report.originalname,
      filepath: report.path
    } : null;

    const lecturePoster = poster ? {
      filename: poster.originalname,
      filepath: poster.path
    } : null;

    const newLecture = {
      conducted: 'Expert Lecture',
      title,
      instructor,
      report: lectureReport,
      poster: lecturePoster,
      coordinator: coordinator ? coordinator._id : null,
      userId: user._id,
      status: 'Pending',
      empId: user.employeeId,
      empName: user.firstName+' '+user.lastName,
      cordName: coordinator ? `${coordinator.firstName} ${coordinator.lastName}` : '',
      coordId: coordinator ? coordinator.employeeId : ''
    };

    if (!Array.isArray(user.expertLectures)) {
      user.expertLectures = [];
    }

    user.expertLectures.push(newLecture);
    
    await user.save();

    res.send({ message: 'Expert Lecture details uploaded successfully' , expertLectureId: newLecture._id});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading Expert Lecture details' });
  }
});


app.get('/get-employee-name/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const user = await User.findOne({ employeeId });
    if (user) {
      res.send({ name: `${user.title} ${user.firstName} ${user.lastName}` });
    } else {
      res.status(404).send({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching employee name' });
  }
});



// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// Route for uploading ExtraClass details
app.post('/upload-extra-class-details', authenticateToken, upload.none(), async (req, res) => {
  const userId = req.user.id; // Ensure this is the correct way to get user ID from your auth middleware
  const { date, fromTime, toTime, title } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Create a new ExtraClass object
    const newExtraClass = {
      conducted:'Extra Class',
      date,
      fromTime,
      toTime,
      title,
      status: 'Pending',
      empId: user.employeeId,
      empName: user.firstName+' '+user.lastName,
    };

    // Add the new ExtraClass to the user's array of extra classes
    user.extraClasses.push(newExtraClass);
    
    // Save the user
    await user.save();

    // Send success response
    res.send({ message: 'Extra class details uploaded successfully' ,extraClassId: newExtraClass._id});
    console.log('Success')
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading extra class details' });
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------

// MOOC Route
app.post('/upload-MOOC-details', authenticateToken, uploadResearchFiles.fields([{name:'details'}]),async(req,res) => {
  const userId = req.user.id;
  const details = req.files.details ? req.files.details[0] : null;
  const { hasCoordinator, coordinatorId } = req.body;


  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    let coordinator = null;
    if (hasCoordinator && coordinatorId) {
      coordinator = await User.findOne({ employeeId: coordinatorId });
      if (!coordinator) {
        return res.status(404).send({ message: 'Coordinator not found' });
      }
    }

    const lectureDetails = details ? {
      conducted:'MOOC',
      details,
      status: 'Pending',
      coordinator: coordinator ? coordinator._id : null,
      userId: user._id,
      empId: user.employeeId,
      empName: user.firstName+' '+user.lastName,
      cordName: coordinator ? `${coordinator.firstName} ${coordinator.lastName}` : '',
      coordId: coordinator ? coordinator.employeeId : ''
    } : null;

    const newMOOC={
      details: lectureDetails
    }

    if(!Array.isArray(user.MOOC)) {
      user.MOOC=[];
    }

    user.MOOC.push(newMOOC);
    await user.save();

    res.send({message: 'MOOC Details uploaded Successfully', moocId: newMOOC._id});
  }catch(error){
    console.error(error);
    res.status(500).send({message:' Error Uploading MOOC details'});
  }

});


// ----------------------------------------------------------------------------------------------------------------------------------------------------------

// Value Added Course

app.post('/upload-valueAdd-details', authenticateToken, uploadResearchFiles.fields([{name:'syllabus'}]),async(req,res) => {
  const userId = req.user.id;
  const syllabus = req.files.syllabus ? req.files.syllabus[0] : null;
  const { courseName, hoursRequired, credits, description } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const syllabusDetails = syllabus ? {
      filename: syllabus.originalname,
      filepath: syllabus.path
    } : null;

    const newValCourse={
      conducted: 'Value Added Course',
      courseName,
      hoursRequired,
      credits,
      description,
      syllabus: syllabusDetails,
      status:'Pending',
      userId: user._id,
      empId: user.employeeId,
      empName: user.firstName+' '+user.lastName
    }

    if(!Array.isArray(user.valAddCourses)) {
      user.valAddCourses=[];
    }

    user.valAddCourses.push(newValCourse);
    await user.save();

    res.send({message: 'Value added course details uploaded Successfully',valAddCourseId: newValCourse._id});
  }catch(error){
    console.error(error);
    res.status(500).send({message:' Error Uploading Value added course details'})
  }

});



app.post('/upload-publication-details', authenticateToken, uploadResearchFiles.fields([{name: 'publicationFile'}]), async (req, res) => {
  const userId = req.user.id;
  const publicationFile = req.files.publicationFile ? req.files.publicationFile[0] : null;
  const { publicationTitle, publicationID, publicationURL, description } = req.body;
  const { hasCoordinator, coordinatorId } = req.body;
  let coordinator = null;
  if (hasCoordinator && coordinatorId) {
    coordinator = await User.findOne({ employeeId: coordinatorId });
    if (!coordinator) {
      return res.status(404).send({ message: 'Coordinator not found' });
    }
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const publicationFileDetails = publicationFile ? {
      filename: publicationFile.originalname,
      filepath: publicationFile.path
    } : null;

    const newPublication = {
      conducted:"Publication",
      title:publicationTitle,
      publicationId,
      publicationURL,
      description,
      publicationFile: publicationFileDetails,
      coordinator: coordinator ? coordinator._id : null,
      userId: user._id,
      status: 'Pending',
      empId: user.employeeId,
      empName: user.firstName+' '+user.lastName,
      cordName: coordinator ? `${coordinator.firstName} ${coordinator.lastName}` : '',
      coordId: coordinator ? coordinator.employeeId : ''
    };

    if (!Array.isArray(user.publications)) {
      user.publications = [];
    }

    user.publications.push(newPublication);
    await user.save();

    res.send({ message: 'Publication details uploaded successfully', publicationId: newPublication._id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading publication details' });
  }
});

app.post('/upload-industrialVisit-details', authenticateToken, upload.array('bills'), async (req, res) => {
  const userId = req.user.id;
  const { placeOfVisit, mediumOfTransport, costOfTransport, additionalCharges } = req.body;
  const { hasCoordinator, coordinatorId } = req.body;

  let coordinator = null;
  if (hasCoordinator && coordinatorId) {
    coordinator = await User.findOne({ employeeId: coordinatorId });
    if (!coordinator) {
      return res.status(404).send({ message: 'Coordinator not found' });
    }
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const bills = req.files.map(file => ({
      filename: file.originalname,
      filepath: file.path
    }));

    const coordinator = coordinatorId ? await User.findById(coordinatorId) : null;

    const newVisit = {
      condusted:'Student Industrial Visit',
      placeOfVisit,
      mediumOfTransport,
      costOfTransport,
      additionalCharges,
      bills,
      coordinator: coordinator ? coordinator._id : null,
      userId: user._id,
      status: 'Pending',
      empId: user.employeeId,
      empName: user.firstName + ' ' + user.lastName,
      cordName: coordinator ? `${coordinator.firstName} ${coordinator.lastName}` : '',
      coordId: coordinator ? coordinator.employeeId : ''
    };

    if (!Array.isArray(user.industrialVisits)) {
      user.industrialVisits = [];
    }

    user.industrialVisits.push(newVisit);
    await user.save();

    res.send({ message: 'Industrial Visit details uploaded successfully', industrialVisitId: newVisit._id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading Industrial Visit details' });
  }
});


// =================================================================================================================================================

// // Get pending hackathons route
// app.get('/get-pending-hackathons', authenticateToken, async (req, res) => {
//   try {
//     const users = await User.find({ 'hackathons.status': 'Pending' }, { 'hackathons.$': 1, name: 1, employeeId: 1 });

//     const pendingHackathons = users.flatMap(user => 
//       user.hackathons.filter(hackathon => hackathon.status === 'Pending').map(hackathon => ({
//         ...hackathon._doc,
//         userName: user.name,
//         userEmployeeId: user.employeeId,
//         userId: user._id
//       }))
//     );

//     res.send(pendingHackathons);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error fetching pending hackathons' });
//   }
// });

// app.get('/get-pending-valAddCourses', authenticateToken, async (req, res) => {
//   try {
//     const users = await User.find({ 'valAddCourses.status': 'Pending' }, { 'valAddCourses.$': 1, name: 1, employeeId: 1 });

//     const pendingvalAddCourses = users.flatMap(user => 
//       user.valAddCourses.filter(valAddCourse => valAddCourse.status === 'Pending').map(valAddCourse => ({
//         ...valAddCourse._doc,
//         userName: user.name,
//         userEmployeeId: user.employeeId,
//         userId: user._id
//       }))
//     );

//     res.send(pendingvalAddCourses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error fetching pending Value Added Courses' });
//   }
// });

// app.get('/get-pending-expert-lectures', authenticateToken, async (req, res) => {
//   try {
//     const users = await User.find({ 'expertLectures.status': 'Pending' }, { 'expertLectures.$': 1, name: 1, employeeId: 1 });

//     const pendingExpertLectures = users.flatMap(user => 
//       user.expertLectures.filter(lecture => lecture.status === 'Pending').map(lecture => ({
//         ...lecture._doc,
//         userName: user.name,
//         userEmployeeId: user.employeeId,
//         userId: user._id
//       }))
//     );

//     res.send(pendingExpertLectures);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error fetching pending expert lectures' });
//   }
// });

// // Get pending trainings route
// app.get('/get-pending-trainings', authenticateToken, async (req, res) => {
//   try {
//     const users = await User.find({ 'trainings.status': 'Pending' }, { 'trainings.$': 1, name: 1, employeeId: 1 });

//     const pendingTrainings = users.flatMap(user => 
//       user.trainings.filter(training => training.status === 'Pending').map(training => ({
//         ...training._doc,
//         userName: user.name,
//         userEmployeeId: user.employeeId,
//         userId: user._id
//       }))
//     );

//     res.send(pendingTrainings);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error fetching pending trainings' });
//   }
// });

// // Get pending Resesraches route
// app.get('/get-pending-researches', authenticateToken, async (req, res) => {
//   try {
//     const users = await User.find({ 'researches.status': 'Pending' }, { 'researches.$': 1, name: 1, employeeId: 1 });

//     const pendingResearches = users.flatMap(user => 
//       user.researches.filter(research => research.status === 'Pending').map(research => ({
//         ...research._doc,
//         userName: user.name,
//         userEmployeeId: user.employeeId,
//         userId: user._id
//       }))
//     );

//     res.send(pendingResearches);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error fetching Pending Researches' });
//   }
// });
const getPendingActivities = async (req, res, activityType, userField) => {
  try {
    const users = await User.find({ [`${userField}.status`]: 'Pending' }, { [`${userField}.$`]: 1, name: 1, employeeId: 1 });

    const pendingActivities = users.flatMap(user => 
      user[userField].filter(activity => activity.status === 'Pending').map(activity => ({
        ...activity._doc,
        userName: user.name,
        userEmployeeId: user.employeeId,
        userId: user._id
      }))
    );

    res.send(pendingActivities);
  } catch (error) {
    console.error(`Error fetching pending ${activityType}`, error);
    res.status(500).send({ message: `Error fetching pending ${activityType}` });
  }
};

// Specific get routes
app.get('/get-pending-hackathons', authenticateToken, (req, res) => getPendingActivities(req, res, 'Hackathons', 'hackathons'));
app.get('/get-pending-valAddCourses', authenticateToken, (req, res) => getPendingActivities(req, res, 'Value Added Courses', 'valAddCourses'));
app.get('/get-pending-expert-lectures', authenticateToken, (req, res) => getPendingActivities(req, res, 'Expert Lectures', 'expertLectures'));
app.get('/get-pending-trainings', authenticateToken, (req, res) => getPendingActivities(req, res, 'Trainings', 'trainings'));
app.get('/get-pending-researches', authenticateToken, (req, res) => getPendingActivities(req, res, 'Researches', 'researches'));
app.get('/get-pending-extraClasses', authenticateToken, (req, res) => getPendingActivities(req, res, 'Extra Classes', 'extraClasses'));
app.get('/get-pending-mooc', authenticateToken, (req, res) => getPendingActivities(req, res, 'MOOC', 'MOOC'));
app.get('/get-pending-publications', authenticateToken, (req, res) => getPendingActivities(req, res, 'Publications', 'publications'));
app.get('/get-pending-student-industrial-visits', authenticateToken, (req, res) => getPendingActivities(req, res, 'Student Industrial Visits', 'studentIndustrialVisits'));



// Function to get rejected activities
const getRejectedActivities = async (req, res, activityType, userField) => {
  try {
    const users = await User.find({ [`${userField}.status`]: 'Rejected' }, { [`${userField}.$`]: 1, name: 1, employeeId: 1 });

    const rejectedActivities = users.flatMap(user => 
      user[userField].filter(activity => activity.status === 'Rejected').map(activity => ({
        ...activity._doc,
        userName: user.name,
        userEmployeeId: user.employeeId,
        userId: user._id
      }))
    );

    res.send(rejectedActivities);
  } catch (error) {
    console.error(`Error fetching rejected ${activityType}`, error);
    res.status(500).send({ message: `Error fetching rejected ${activityType}` });
  }
};

// Specific get routes for rejected activities
app.get('/get-rejected-hackathons', authenticateToken, (req, res) => getRejectedActivities(req, res, 'Hackathons', 'hackathons'));
app.get('/get-rejected-valAddCourses', authenticateToken, (req, res) => getRejectedActivities(req, res, 'Value Added Courses', 'valAddCourses'));
app.get('/get-rejected-expert-lectures', authenticateToken, (req, res) => getRejectedActivities(req, res, 'Expert Lectures', 'expertLectures'));
app.get('/get-rejected-trainings', authenticateToken, (req, res) => getRejectedActivities(req, res, 'Trainings', 'trainings'));
app.get('/get-rejected-researches', authenticateToken, (req, res) => getRejectedActivities(req, res, 'Researches', 'researches'));
app.get('/get-rejected-extra-classes', authenticateToken, (req, res) => getRejectedActivities(req, res, 'Extra Classes', 'extraClasses'));
app.get('/get-rejected-mooc', authenticateToken, (req, res) => getRejectedActivities(req, res, 'MOOC', 'MOOC'));
app.get('/get-rejected-publications', authenticateToken, (req, res) => getRejectedActivities(req, res, 'Publications', 'publications'));
app.get('/get-rejected-student-industrial-visits', authenticateToken, (req, res) => getRejectedActivities(req, res, 'Student Industrial Visits', 'studentIndustrialVisits'));



// =================================================================================================================================================
// // Approve hackathon route
// app.post('/approve-hackathon/:id', authenticateToken, async (req, res) => {
//   const hackathonId = req.params.id;

//   try {
//     // Find the user with the pending hackathon
//     const user = await User.findOne({ 'hackathons._id': hackathonId });
//     if (!user) {
//       return res.status(404).send({ message: 'Hackathon not found' });
//     }

//     // Find the specific hackathon within the user's hackathons
//     const hackathon = user.hackathons.id(hackathonId);
//     if (!hackathon) {
//       return res.status(404).send({ message: 'Hackathon not found' });
//     }

//     // Check if the hackathon is in pending status
//     if (hackathon.status !== 'Pending') {
//       return res.status(400).send({ message: 'Hackathon is not pending' });
//     }

//     // Approve the hackathon
//     hackathon.status = 'Approved';

//     // Award points to the user
//     const points = hackathon.coordinatorId ? 1 : 2;
//     user.totalPoints += points;
//     user.pointsLog.push({
//       activityType: 'Hackathon',
//       title: hackathon.title,
//       fromDate: hackathon.startDate,
//       toDate: hackathon.endDate,
//       pointsEarned: points
//     });

//     // If there is a coordinator, update their points as well
//     if (hackathon.coordinatorId) {
//       const coordinator = await User.findById(hackathon.coordinatorId);
//       if (coordinator) {
//         coordinator.totalPoints += points;
//         coordinator.pointsLog.push({
//           activityType: 'Hackathon (Coordinator)',
//           title: hackathon.title,
//           fromDate: hackathon.startDate,
//           toDate: hackathon.endDate,
//           pointsEarned: points
//         });
//         await coordinator.save();
//       }
//     }

//     // Save the user with the updated hackathon status and points
//     await user.save();

//     res.send({ message: 'Hackathon approved successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error approving hackathon' });
//   }
// });

// Generalized function for approving an activity
const approveActivity = async (req, res, activityType, userField) => {
  const activityId = req.params.id;

  try {
    const user = await User.findOne({ [`${userField}._id`]: activityId });
    if (!user) {
      return res.status(404).send({ message: `${activityType} not found` });
    }

    const activity = user[userField].id(activityId);
    if (!activity) {
      return res.status(404).send({ message: `${activityType} not found` });
    }

    if (activity.status !== 'Pending') {
      return res.status(400).send({ message: `${activityType} is not pending` });
    }

    activity.status = 'Approved';
    const points = activity.coordinatorId ? 1 : 2;
    points=(activity.conducted==='MOOC') && (activity.coordinatorId)?3:6;
    user.totalPoints += points;
    user.pointsLog.push({
      activityType,
      title: activity.title,
      fromDate: new Date(),
      pointsEarned: points
    });

    if (activity.coordinatorId) {
      const coordinator = await User.findById(activity.coordinatorId);
      if (coordinator) {
        coordinator.totalPoints += points;
        coordinator.pointsLog.push({
          activityType: `${activityType} (Coordinator)`,
          title: activity.title,
          fromDate: new Date(),
          pointsEarned: points
        });
        await coordinator.save();
      }
    }

    await user.save();
    res.send({ message: `${activityType} approved successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Error approving ${activityType}` });
  }
};
                      
// Approve hackathon route
app.post('/approve-hackathon/:id', authenticateToken, async (req, res) => {
  approveActivity(req, res, 'Hackathon', 'hackathons');
});

// Approve expert lecture route
app.post('/approve-expert-lecture/:id', authenticateToken, async (req, res) => {
  approveActivity(req, res, 'Industry Expert Lecture', 'expertLectures');
});


// Approve MOOC
app.post('/approve-mooc/:id', authenticateToken, async (req, res) => {
  approveActivity(req, res, 'MOOC', 'MOOC');
});

app.post('/approve-training/:id', authenticateToken, async (req, res) => {
  const trainingId = req.params.id;
  try {
    const user = await User.findOne({ 'trainings._id': trainingId });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const training = user.trainings.id(trainingId);
    if (!training) {
      return res.status(404).send({ message: 'Training not found' });
    }

    if (training.status !== 'Pending') {
      return res.status(400).send({ message: 'Training is not pending' });
    }

    training.status = 'Approved';

    // Calculate points based on training duration
    const from = new Date(training.fromDate);
    const to = new Date(training.toDate);
    const diffTime = Math.abs(to - from);
    const noOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const hours = parseFloat(training.duration);
    const oneDayPoints = 1; // Points for a one-day FDP
    const pointsPerHour = 0.125;
    let points = 0;

    if (hours >= 5) {
      points = noOfDays * oneDayPoints;
    } else {
      points = noOfDays * hours * pointsPerHour;
    }

    user.totalPoints += points;
    user.pointsLog.push({
      activityType: 'Training',
      title: training.title,
      fromDate: training.fromDate,
      toDate: training.toDate,
      pointsEarned: points,
    });

    user.isTrainingCompleted = true; // Update training status

    await user.save();

    res.send({ message: 'Training approved and points added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error Approving Training' });
  }
});


app.post('/approve-value-added-course/:id', authenticateToken, async (req, res) => {
  const valAddCourseId = req.params.id;
  try {
    const user = await User.findOne({ 'valAddCourses._id': valAddCourseId });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const valAddCourse = user.valAddCourses.id(valAddCourseId);
    if (!valAddCourse) {
      return res.status(404).send({ message: 'Value Added Course not found' });
    }

    if (valAddCourse.status !== 'Pending') {
      return res.status(400).send({ message: 'Value Added Course is not pending' });
    }

    valAddCourse.status = 'Approved';

    let points = 5;

    user.totalPoints += points;
    user.pointsLog.push({
      activityType: 'Value Add Course',
      title: valAddCourse.courseName,
      fromDate: new Date(),
      toDate: new Date(),
      pointsEarned: points,
    });


    await user.save();

    res.send({ message: 'Value Added Course approved and points added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error Approving Value Added Course' });
  }
});

// Approve research route
app.post('/approve-research/:id', authenticateToken, async (req, res) => {
  const researchId = req.params.id;
  try {
    const user = await User.findOne({ 'researches._id': researchId });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const research = user.researches.id(researchId);
    if (!research) {
      return res.status(404).send({ message: 'Research not found' });
    }

    if (research.status !== 'Pending') {
      return res.status(400).send({ message: 'Research is not pending' });
    }

    research.status = 'Approved';

    let points = 5;

    user.totalPoints += points;
    user.pointsLog.push({
      activityType: 'Research',
      title: research.title,
      fromDate: new Date(),
      toDate: new Date(),
      pointsEarned: points,
    });

    await user.save();

    res.send({ message: 'Research approved and points added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error Approving Research' });
  }
});


app.post('/approve-publications/:id', authenticateToken, async (req, res) => {
  const publicationId = req.params.id;
  try {
    const user = await User.findOne({ 'publications._id': publicationId });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const publication = user.publications.id(publicationId);
    if (!publication) {
      return res.status(404).send({ message: 'Publication not found' });
    }

    if (publication.status !== 'Pending') {
      return res.status(400).send({ message: 'Publication is not pending' });
    }

    publication.status = 'Approved';

    let points = publication.coordinatorId ? 2.5 : 5;

    user.totalPoints += points;
    user.pointsLog.push({
      activityType: 'Publication',
      title: publication.title,
      fromDate: new Date(),
      pointsEarned: points
    });

    if (publication.coordinatorId) {
      const coordinator = await User.findById(publication.coordinatorId);
      if (coordinator) {
        coordinator.totalPoints += points;
        coordinator.pointsLog.push({
          activityType: 'Publication (Coordinator)',
          title: publication.title,
          fromDate: new Date(),
          pointsEarned: points
        });
        await coordinator.save();
      }
    }

    await user.save();

    res.send({ message: 'Publication approved and points added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error Approving Publication' });
  }
});


app.post('/approve-extra-classes/:id', authenticateToken, async (req, res) => {
  const extraClassId = req.params.id;
  try {
    const user = await User.findOne({ 'extraClasses._id': extraClassId });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const extraClass = user.extraClasses.id(extraClassId);
    if (!extraClass) {
      return res.status(404).send({ message: 'Extra Class not found' });
    }

    if (extraClass.status !== 'Pending') {
      return res.status(400).send({ message: 'Extra Class is not pending' });
    }

    extraClass.status = 'Approved';

    let points = 0.5;

    user.totalPoints += points;
    user.pointsLog.push({
      activityType: 'Extra Classes',
      title: extraClass.topic,
      fromDate: extraClass.date,
      toDate: new Date(),
      pointsEarned: points,
    });


    await user.save();

    res.send({ message: 'Extra Class approved and points added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error Approving Extra Class' });
  }
});

app.post('/approve-industrialVisit/:id', authenticateToken, async (req, res) => {
  const visitId = req.params.id;
  try {
    const user = await User.findOne({ 'industrialVisits._id': visitId });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const industrialVisit = user.industrialVisits.id(visitId);
    if (!industrialVisit) {
      return res.status(404).send({ message: 'Industrial Visit not found' });
    }

    if (industrialVisit.status !== 'Pending') {
      return res.status(400).send({ message: 'Industrial Visit is not pending' });
    }

    industrialVisit.status = 'Approved';

    let points = industrialVisit.coordinatorId ? 2.5 : 5;

    user.totalPoints += points;
    user.pointsLog.push({
      activityType: 'Industrial Visit',
      title: industrialVisit.placeOfVisit,
      fromDate: new Date(),
      pointsEarned: points
    });

    if (industrialVisit.coordinatorId) {
      const coordinator = await User.findById(industrialVisit.coordinatorId);
      if (coordinator) {
        coordinator.totalPoints += points;
        coordinator.pointsLog.push({
          activityType: 'Industrial Visit (Coordinator)',
          title: industrialVisit.placeOfVisit,
          fromDate: new Date(),
          pointsEarned: points
        });
        await coordinator.save();
      }
    }

    await user.save();

    res.send({ message: 'Industrial Visit approved and points added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error Approving Industrial Visit' });
  }
});





const deleteActivity = async (req, res, activityType, userField) => {
  const activityId = req.params.id;
  try {
    // Find the user and update by pulling the activity with the given ID
    const user = await User.findOneAndUpdate(
      { [`${userField}._id`]: activityId },
      { $pull: { [userField]: { _id: activityId } } },
      { new: true }
    );

    if (!user) {
      console.error(`${activityType} with ID ${activityId} not found`);
      return res.status(404).send({ message: `${activityType} not found` });
    }

    res.send({ message: `${activityType} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting ${activityType} with ID ${activityId}:`, error);
    res.status(500).send({ message: `Error deleting ${activityType}` });
  }
};

// Specific delete routes
app.delete('/delete-hackathon/:id', authenticateToken, (req, res) => deleteActivity(req, res, 'Hackathon', 'hackathons'));
app.delete('/delete-expert-lecture/:id', authenticateToken, (req, res) => deleteActivity(req, res, 'Expert Lecture', 'expertLectures'));
app.delete('/delete-training/:id', authenticateToken, (req, res) => deleteActivity(req, res, 'Training', 'trainings'));
app.delete('/delete-value-added-course/:id', authenticateToken, (req, res) => deleteActivity(req, res, 'Value Added Course', 'valAddCourses'));
app.delete('/delete-research/:id', authenticateToken, (req, res) => deleteActivity(req, res, 'Research', 'researches'));
app.delete('/delete-extra-classes/:id', authenticateToken, (req, res) => deleteActivity(req, res, 'Extra Class', 'extraClasses'));
app.delete('/delete-mooc/:id', authenticateToken, (req, res) => deleteActivity(req, res, 'MOOC', 'MOOC'));
app.delete('/delete-student-industrial-visit/:id', authenticateToken, (req, res) => deleteActivity(req, res, 'MOOC', 'MOOC'));
app.delete('/delete-publications/:id', authenticateToken, (req, res) => deleteActivity(req, res, 'MOOC', 'MOOC'));

// Example route for rejecting a Hackathon request with reason
// app.post('/reject-hackathon/:id', authenticateToken, async (req, res) => {
//   const hackathonId = req.params.id;
//   const { reason } = req.body; // Extract reason from request body

//   try {
//     // Find the Hackathon by ID and update its status and reason
//     const updatedHackathon = await User.findOneAndUpdate(
//       { 'hackathons._id': hackathonId },
//       { 
//         $set: {
//           'hackathons.$.status': 'Rejected',
//           'hackathons.$.rejectReason': reason, // Store the rejection reason
//         } 
//       },
//       { new: true }
//     );

//     if (!updatedHackathon) {
//       return res.status(404).json({ message: 'Hackathon not found' });
//     }

//     res.status(200).json({ message: 'Hackathon rejected successfully' });
//   } catch (error) {
//     console.error(`Error rejecting Hackathon with ID ${hackathonId}:`, error);
//     res.status(500).json({ message: 'Error rejecting Hackathon' });
//   }
// });

const rejectActivity = async (req, res, activityType, userField) => {
  const activityId = req.params.id;
  const { reason } = req.body; // Extract reason from request body

  try {
    // Find the user and update the specific activity's status and rejection reason
    const user = await User.findOneAndUpdate(
      { [`${userField}._id`]: activityId },
      { 
        $set: {
          [`${userField}.$.status`]: 'Rejected',
          [`${userField}.$.rejectReason`]: reason, // Store the rejection reason
        }
      },
      { new: true }
    );

    if (!user) {
      console.error(`${activityType} with ID ${activityId} not found`);
      return res.status(404).send({ message: `${activityType} not found` });
    }

    res.send({ message: `${activityType} rejected successfully` });
  } catch (error) {
    console.error(`Error rejecting ${activityType} with ID ${activityId}:`, error);
    res.status(500).send({ message: `Error rejecting ${activityType}` });
  }
};

app.post('/reject-hackathon/:id', authenticateToken, (req, res) => rejectActivity(req, res, 'Hackathon', 'hackathons'));
app.post('/reject-expert-lecture/:id', authenticateToken, (req, res) => rejectActivity(req, res, 'Expert Lecture', 'expertLectures'));
app.post('/reject-training/:id', authenticateToken, (req, res) => rejectActivity(req, res, 'Training', 'trainings'));
app.post('/reject-valAddCourse/:id', authenticateToken, (req, res) => rejectActivity(req, res, 'Value Added Course', 'valAddCourses'));
app.post('/reject-research/:id', authenticateToken, (req, res) => rejectActivity(req, res, 'Research', 'researches'));
app.post('/reject-extra-classes/:id', authenticateToken, (req, res) => rejectActivity(req, res, 'Extra Class', 'extraClasses'));
app.post('/reject-mooc/:id', authenticateToken, (req, res) => rejectActivity(req, res, 'MOOC', 'MOOC'));
app.post('/reject-student-industrial-visit/:id', authenticateToken, (req, res) => rejectActivity(req, res, 'MOOC', 'MOOC'));
app.post('/reject-publications/:id', authenticateToken, (req, res) => rejectActivity(req, res, 'MOOC', 'MOOC'));




// -------------------------------------------------------------------------------------------------------------------------------------------------

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});