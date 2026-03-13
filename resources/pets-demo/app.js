const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const basicAuth = require('basic-auth');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const secretKey = 'your_secret_key';

const users = {
  admin: 'password123',
  user: 'userpassword'
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authenticateBasic = (req, res, next) => {
  const user = basicAuth(req);

  if (!user || !users[user.name] || users[user.name] !== user.pass) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.sendStatus(401);
  }

  req.user = user;
  next();
};

app.get('/', (req, res) => {
  res.send('Hello, this is a public endpoint!');
});

/**
 * @swagger
 * /protected-bearer:
 *   get:
 *     summary: Access a protected endpoint using Bearer token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get('/protected-bearer', authenticateToken, (req, res) => {
  res.send(`Hello ${req.user.name}, you have accessed a protected endpoint!`);
});

/**
 * @swagger
 * /protected-basic:
 *   get:
 *     summary: Access a protected endpoint using Basic authentication
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get('/protected-basic', authenticateBasic, (req, res) => {
  res.send(`Hello ${req.user.name}, you have accessed a protected endpoint!`);
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Generate a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 */
app.post('/login', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      status: 'error',
      message: 'Username is required',
      data: null
    });
  }

  const user = { name: username };
  const accessToken = jwt.sign(user, secretKey);

  res.json({
    status: 'success',
    message: 'Token generated',
    data: { accessToken }
  });
});

// Helper functions to read and write to the JSON file
//>const readPetsFromFile = () => {
//>  const data = fs.readFileSync('pets.json');
//>  return JSON.parse(data);
//>};
//>
//>const writePetsToFile = (pets) => {
//>  fs.writeFileSync('pets.json', JSON.stringify(pets, null, 2));
//>};
// Helper functions to read and write to the JSON file

const PETS_FILE = path.join(__dirname, 'pets.json');

const ensurePetsFileExists = () => {
  if (!fs.existsSync(PETS_FILE)) {
    fs.writeFileSync(PETS_FILE, JSON.stringify([], null, 2));
  }
};

const readPetsFromFile = () => {
  ensurePetsFileExists();
  const data = fs.readFileSync(PETS_FILE, 'utf-8');
  return JSON.parse(data);
};

const writePetsToFile = (pets) => {
  fs.writeFileSync(PETS_FILE, JSON.stringify(pets, null, 2));
};
/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Create a new pet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fluffy"
 *               type:
 *                 type: string
 *                 example: "Dog"
 *               age:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     age:
 *                       type: integer
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 */
app.post('/pets', (req, res) => {
  const { name, type, age } = req.body;

  if (!name || !type || !Number.isInteger(age)) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, type, and age are required',
      data: null
    });
  }

  const pets = readPetsFromFile();
  const newPet = { id: Date.now(), name, type, age };
  pets.push(newPet);
  writePetsToFile(pets);

  res.status(201).json({
    status: 'success',
    message: 'Pet created',
    data: newPet
  });
});

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Retrieve all pets
 *     responses:
 *       200:
 *         description: Pets retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       age:
 *                         type: integer
 */
app.get('/pets', (req, res) => {
  const pets = readPetsFromFile();
  res.json({
    status: 'success',
    message: 'Pets retrieved',
    data: pets
  });
});

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Retrieve a pet by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Pet found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     age:
 *                       type: integer
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 */
app.get('/pets/:id', (req, res) => {
  const pets = readPetsFromFile();
  const pet = pets.find(p => p.id === parseInt(req.params.id, 10));

  if (!pet) {
    return res.status(404).json({
      status: 'error',
      message: 'Pet not found',
      data: null
    });
  }

  res.json({
    status: 'success',
    message: 'Pet found',
    data: pet
  });
});

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update a pet by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pet updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     age:
 *                       type: integer
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 */
app.put('/pets/:id', (req, res) => {
  const { name, type, age } = req.body;
  const pets = readPetsFromFile();
  const petIndex = pets.findIndex(p => p.id === parseInt(req.params.id, 10));

  if (petIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Pet not found',
      data: null
    });
  }

  if (!name || !type || !Number.isInteger(age)) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, type, and age are required',
      data: null
    });
  }

  const updatedPet = { id: parseInt(req.params.id, 10), name, type, age };
  pets[petIndex] = updatedPet;
  writePetsToFile(pets);

  res.json({
    status: 'success',
    message: 'Pet updated',
    data: updatedPet
  });
});

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Delete a pet by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Pet deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 */
app.delete('/pets/:id', (req, res) => {
  const pets = readPetsFromFile();
  const petIndex = pets.findIndex(p => p.id === parseInt(req.params.id, 10));

  if (petIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Pet not found',
      data: null
    });
  }

  pets.splice(petIndex, 1);
  writePetsToFile(pets);

  res.status(204).json({
    status: 'success',
    message: 'Pet deleted',
    data: null
  });
});

/**
 * @swagger
 * /pets/{id}:
 *   patch:
 *     summary: Partially update a pet by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pet updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     age:
 *                       type: integer
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 */
app.patch('/pets/:id', (req, res) => {
  const { name, type, age } = req.body;
  const pets = readPetsFromFile();
  const petIndex = pets.findIndex(p => p.id === parseInt(req.params.id, 10));

  if (petIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Pet not found',
      data: null
    });
  }

  const pet = pets[petIndex];

  if (name) pet.name = name;
  if (type) pet.type = type;
  if (Number.isInteger(age)) pet.age = age;

  pets[petIndex] = pet;
  writePetsToFile(pets);

  res.json({
    status: 'success',
    message: 'Pet updated successfully',
    data: pet
  });
});

/* ENDPOINTS WITH AUTHORIZATION AND AUTHENTICATION */
/**
 * @swagger
 * /protected/pets:
 *   post:
 *     summary: Create a new pet - Protected
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fluffy"
 *               type:
 *                 type: string
 *                 example: "Dog"
 *               age:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     age:
 *                       type: integer
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 */
app.post('/protected/pets', authenticateToken, (req, res) => {
  const { name, type, age } = req.body;

  if (!name || !type || !Number.isInteger(age)) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, type, and age are required',
      data: null
    });
  }

  const pets = readPetsFromFile();
  const newPet = { id: Date.now(), name, type, age };
  pets.push(newPet);
  writePetsToFile(pets);

  res.status(201).json({
    status: 'success',
    message: 'Pet created',
    data: newPet
  });
});


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet API',
      version: '1.0.0',
      description: 'A simple Express Pet API'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        basicAuth: {
          type: 'http',
          scheme: 'basic'
        }
      }
    }
  },
  apis: ['./app.js']
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

ensurePetsFileExists();
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
