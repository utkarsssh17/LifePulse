import { connectDB, closeDB } from '../config/db.js';
import User from '../models/user.js';
import Event from '../models/event.js';
import { uploadImageToS3 } from '../controllers/images.js';
import path from 'path';
import fs from 'fs';

// Connect to database
connectDB();

// Drop collections
await User.deleteMany({});
await Event.deleteMany({});
console.log('Users and events collections dropped');

const usersImageDir = path.join(path.resolve(), 'db-seed/images/users');
const eventsImageDir = path.join(path.resolve(), 'db-seed/images/events');

// Upload pictures to AWS S3
const uploadPictures = async (filenames, directory) => {
    try {
        const pictures = [];
        for (const filename of filenames) {
            const filePath = path.join(directory, filename);
            const file = fs.readFileSync(filePath);
            file.originalname = filename;
            const result = await uploadImageToS3(file);
            pictures.push(result.fileName);
        }
        return pictures;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Generate random password
const generatePassword = (username) => {
    const randomizeCase = (str) => {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += Math.random() < 0.5 ? str[i].toUpperCase() : str[i].toLowerCase();
        }
        return result;
    }
    const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', ',', '.', '?', ':', '{', '}', '|', '<', '>'];
    const randomSpecialChars = specialChars.sort(() => 0.5 - Math.random()).slice(0, 2).join('');
    const password = randomizeCase(username) + randomSpecialChars + (Math.floor(Math.random() * 100).toString());
    return password;
}

// Dummy users data
const users = [
    {
        firstName: 'Walter',
        lastName: 'White',
        username: 'heisenberg',
        email: 'ww@breakingbad.com',
        dob: new Date('1958-09-07'),
        bio: 'High school chemistry teacher turned meth cook, and later a drug kingpin.',
        location: 'Albuquerque, New Mexico',
        profilePicture: (await uploadPictures(['Walter_White.jpg'], usersImageDir))[0],
        isProfileComplete: true,
    },
    {
        firstName: 'Jesse',
        lastName: 'Pinkman',
        username: 'capncook',
        email: 'jp@breakingbad.com',
        dob: new Date('1984-09-24'),
        bio: 'Former student of Walter White, turned meth dealer, and later a meth cook.',
        location: 'Albuquerque, New Mexico',
        profilePicture: (await uploadPictures(['Jesse_Pinkman.jpg'], usersImageDir))[0],
        isProfileComplete: true,
    },
    {
        firstName: 'Gustavo',
        lastName: 'Fring',
        username: 'los_pollos_hermanos',
        email: 'gf@lospollos.com',
        dob: new Date('1958-12-23'),
        bio: 'Owner of Los Pollos Hermanos and a major meth distributor.',
        location: 'Albuquerque, New Mexico',
        profilePicture: (await uploadPictures(['Gustavo_Fring.jpg'], usersImageDir))[0],
        isProfileComplete: true,
    },
    {
        firstName: 'Hank',
        lastName: 'Schrader',
        username: 'deahank',
        email: 'hs@dea.gov',
        dob: new Date('1966-03-14'),
        bio: 'DEA agent and brother-in-law of Walter White.',
        location: 'Albuquerque, New Mexico',
        profilePicture: (await uploadPictures(['Hank_Schrader.jpg'], usersImageDir))[0],
        isProfileComplete: true,
    },
    {
        firstName: 'Kim',
        lastName: 'Wexler',
        username: 'kkim',
        email: 'kw@hamlinhamlinmcgill.com',
        dob: new Date('1968-02-13'),
        bio: 'Lawyer at Hamlin, Hamlin & McGil, and Jimmy McGill\'s girlfriend.',
        location: 'Albuquerque, New Mexico',
        profilePicture: (await uploadPictures(['Kim_Wexler.jpg'], usersImageDir))[0],
        isProfileComplete: true,
    },
    {
        firstName: 'Lalo',
        lastName: 'Salamanca',
        username: 'lalosalamanca',
        email: 'ls@salamanca.com',
        dob: new Date('1960-02-17'),
        bio: 'High-ranking member and don of the Salamanca drug cartel.',
        location: 'Mexico',
        profilePicture: (await uploadPictures(['Lalo_Salamanca.jpg'], usersImageDir))[0],
        isProfileComplete: true,
    },
    {
        firstName: 'Mike',
        lastName: 'Ehrmantraut',
        username: 'mike',
        email: 'me@bettercallsaul.com',
        dob: new Date('1944-04-05'),
        bio: 'Former police officer turned hitman and private investigator.',
        location: 'Albuquerque, New Mexico',
        profilePicture: (await uploadPictures(['Mike_Ehrmantraut.jpg'], usersImageDir))[0],
        isProfileComplete: true,
    },
    {
        firstName: 'Ignacio',
        lastName: 'Varga',
        username: 'nacho',
        email: 'nacho@salamanca.com',
        dob: new Date('1971-12-09'),
        bio: 'Former associate of the Salamanca drug cartel, turned DEA informant.',
        location: 'Albuquerque, New Mexico',
        profilePicture: (await uploadPictures(['Nacho_Varga.jpg'], usersImageDir))[0],
        isProfileComplete: true,
    },
    {
        firstName: 'Jimmy',
        lastName: 'McGill',
        username: 'saul_goodman',
        email: 'sg@bettercallsaul.com',
        dob: new Date('1960-11-12'),
        bio: 'Criminal lawyer, Breaking Bad and Better Call Saul, and former con artist.',
        location: 'Albuquerque, New Mexico',
        profilePicture: (await uploadPictures(['Saul_Goodman.jpg'], usersImageDir))[0],
        isProfileComplete: true,
    },
    {
        firstName: 'Skylar',
        lastName: 'White',
        username: 'skylar_white',
        email: 'sw@breakingbad.com',
        dob: new Date('1970-08-11'),
        bio: 'Walt\'s wife, who eventually becomes involved in his drug empire.',
        location: 'Albuquerque, New Mexico',
        profilePicture: (await uploadPictures(['Skylar_White.jpg'], usersImageDir))[0],
        isProfileComplete: true,
    },
];

// Register users
console.log('###############Registering users...###############');
for (let user of users) {
    const { username } = user;
    const password = generatePassword(username);
    await User.register(user, password);
    console.log(`User ${user.username} registered with password ${password}`);
}
console.log('###############Users registered successfully###############');

// Get registered users
const registeredUsers = await User.find({});

// Dummy Events data 
const events = [
    {
        organizerId: registeredUsers[0]._id,
        title: 'Chemistry Masterclass',
        description: 'Learn the basics of chemistry with Walter White. No prior knowledge required.',
        displayPicture: (await uploadPictures(['E1_01.jpg'], eventsImageDir))[0],
        photos: await uploadPictures(['E1_02.jpeg', 'E1_03.jpeg', 'E1_04.jpeg'], eventsImageDir),
        category: ['Education'],
        location: 'Albuquerque, New Mexico',
        maxCapacity: 15,
        eventDate: new Date('2023-06-01'),
        eventTime: '10:00',
        duration: 60,
        attendees: [registeredUsers[1]._id, registeredUsers[3]._id, registeredUsers[7]._id],
    },
    {
        organizerId: registeredUsers[0]._id,
        title: 'Meth Cooking Masterclass',
        description: 'Learn how to cook meth like a pro with Heisenberg. This is a hands-on class. All equipment will be provided. Chemistry knowledge is a plus.',
        displayPicture: (await uploadPictures(['E2_01.jpg'], eventsImageDir))[0],
        photos: await uploadPictures(['E2_02.jpg', 'E2_03.jpg', 'E2_04.jpg', 'E2_05.jpg'], eventsImageDir),
        category: ['Education', 'Cooking'],
        location: 'Albuquerque, New Mexico',
        maxCapacity: 10,
        eventDate: new Date('2023-07-01'),
        eventTime: '14:00',
        duration: 120,
        attendees: [registeredUsers[0]._id, registeredUsers[1]._id, registeredUsers[2]._id, registeredUsers[5]._id, registeredUsers[7]._id],
    },
    {
        organizerId: registeredUsers[2]._id,
        title: 'Drug Cartel Symposium',
        description: 'Join Gustavo Fring and other experts to learn about the ins and outs of the drug cartel business. Learn how to expand your business and how to deal with the DEA. This is a great opportunity to network with other drug lords.',
        displayPicture: (await uploadPictures(['E3_01.jpg'], eventsImageDir))[0],
        photos: await uploadPictures(['E3_02.jpg', 'E3_03.jpg', 'E3_04.jpg'], eventsImageDir),
        category: ['Networking', 'Education'],
        location: 'Mexico City, Mexico',
        maxCapacity: 20,
        eventDate: new Date('2023-08-01'),
        eventTime: '9:00 AM',
        duration: 8,
        attendees: [registeredUsers[1]._id, registeredUsers[3]._id, registeredUsers[7]._id],
    },
    {
        organizerId: registeredUsers[3]._id,
        title: 'DEA Conference',
        description: 'Join Hank Schrader and other DEA agents to learn about the latest techniques in drug busting. Learn how to identify drug labs and how to track down drug lords. We will also discuss the latest in drug laws and regulations. Visit the DEA website for more information.',
        displayPicture: (await uploadPictures(['E4_01.jpg'], eventsImageDir))[0],
        photos: await uploadPictures(['E4_02.jpg', 'E4_03.jpg', 'E4_04.jpg'], eventsImageDir),
        category: ['Education'],
        location: 'Washington D.C., United States',
        maxCapacity: 50,
        eventDate: new Date('2023-09-01'),
        eventTime: '8:00 AM',
        duration: 10,
        attendees: [registeredUsers[1]._id, registeredUsers[3]._id, registeredUsers[7]._id],
    },
    {
        organizerId: registeredUsers[4]._id,
        title: 'Lawyers\' Networking Event',
        description: 'Network with other lawyers and legal professionals at this event hosted by Kim Wexler. This is a great opportunity to meet other lawyers and legal professionals and to learn about the latest in the legal industry. Light refreshments will be served.',
        displayPicture: (await uploadPictures(['E5_01.jpg'], eventsImageDir))[0],
        photos: await uploadPictures(['E5_02.jpg', 'E5_03.jpg', 'E5_04.jpg'], eventsImageDir),
        category: ['Networking', 'Education', 'Food'],
        location: 'Albuquerque, New Mexico',
        maxCapacity: 20,
        eventDate: new Date('2023-10-01'),
        eventTime: '6:00 PM',
        duration: 2,
        attendees: [registeredUsers[1]._id, registeredUsers[3]._id, registeredUsers[7]._id],
    },
    {
        organizerId: registeredUsers[8]._id,
        title: 'Grand Opening of Saul Goodman & Associates',
        description: 'Join us for the grand opening of our new law firm, Saul Goodman & Associates. Come meet Saul Goodman. We will also have a free legal advice session. Know your rights! Bring your questions and we will answer them for free. Better Call Saul!',
        displayPicture: (await uploadPictures(['E6_01.jpg'], eventsImageDir))[0],
        photos: await uploadPictures(['E6_02.jpg'], eventsImageDir),
        category: ['Business', 'Food', 'Education'],
        location: 'J.M. Building, Albuquerque, New Mexico',
        maxCapacity: 100,
        eventDate: new Date('2023-07-01'),
        eventTime: '05:00 PM',
        duration: 3,
        attendees: [registeredUsers[1]._id, registeredUsers[3]._id, registeredUsers[7]._id],
    },
    {
        organizerId: registeredUsers[9]._id,
        title: 'Los Pollos Hermanos Grand Opening Charity Event',
        description: 'Join us for the grand opening of our new restaurant, Los Pollos Hermanos. Come try our famous fried chicken. All proceeds will go to charity.',
        displayPicture: (await uploadPictures(['E7_01.jpg'], eventsImageDir))[0],
        photos: await uploadPictures(['E7_02.jpg', 'E7_03.jpg'], eventsImageDir),
        category: ['Business', 'Food', 'Charity'],
        location: 'Albuquerque, New Mexico',
        maxCapacity: 100,
        eventDate: new Date('2023-07-01'),
        eventTime: '05:00 PM',
        duration: 3,
        attendees: [registeredUsers[1]._id, registeredUsers[3]._id, registeredUsers[7]._id],
    },
    {
        organizerId: registeredUsers[6]._id,
        title: 'Mike Ehrmantraut\'s Retirement Party',
        description: 'Join us for Mike Ehrmantraut\'s retirement party. Gifts are not required but are appreciated. No cops allowed. Must know Mike personally to attend.',
        displayPicture: (await uploadPictures(['E8_01.jpg'], eventsImageDir))[0],
        category: ['Party', 'Food'],
        location: 'Albuquerque, New Mexico',
        maxCapacity: 100,
        eventDate: new Date('2023-07-01'),
        eventTime: '05:00 PM',
        duration: 3,
        attendees: [registeredUsers[1]._id, registeredUsers[3]._id, registeredUsers[7]._id],
    },
]

// Save events to database
console.log('###############Saving events to database...###############');
await Event.insertMany(events);
console.log('###############Events saved to database.###############');

// close database connection
closeDB();
