const userModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtSecretKey = process.env.jwtSecretKey;

const getUsers = async (req, res) => {
    const id  = req.params.id;
    
    try {
        if(id){
            const user = await userModel.findOne({ authToken:id });
            console.log(user)

            res.json({
                user:user
            });
        }
        else{
            res.send({
                msg:"No user Found"
            });
        }
    }
    catch (err) {
        console.log(err);
        res.send({
            status: "fail",
            data: {
                error: err
            }
        })
    }
}

const addUsers = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // Check if the email already exists
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.json({
                status: "Error",
                msg: "Email already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const secretPassword = await bcrypt.hash(password, salt);
        
        const data = {
            user: {
                email: email
            }
        };

        const authToken = jwt.sign(data, jwtSecretKey);
        
        await userModel.create({
            name: name,
            email: email,
            password: secretPassword,
            authToken: authToken,
            Date: new Date().toISOString().split('T')[0] // Ensure you have a valid date
        });

        res.json({
            status: "success"
        });
    } catch (err) {
        console.error(err);
        res.json({
            status: "Error",
            msg: "An error occurred while signing up."
        });
    }
};

const verifyUsers = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email:email });
    try {
        if (!user) {
            res.json({
                status: "false",
                msg: "No Account Found"
            })
        }
        else {
            const chkPass = await bcrypt.compare(password, user.password);
            if (chkPass) {
                res.json({
                    status: "true",
                    users: user,
                    authToken: user.authToken
                })
            }
            else {  
                res.json({
                    status: "false",
                    msg: "Invalid Credentials"
                })
            }
        }
    } 
    catch (err) {
        res.json({
            error: err
        })
    }
}

const replaceProduct = async (req, res) => {
    try {
        const reqId = req.params.id;
        const data = { ...req.body };
        const ans = await productModel.findOneAndReplace({ _id: reqId }, data);

        res.json({
            status: "success",
            results: 1,
            message: "Changed"
        })
    }
    catch (err) {
        res.json({
            status: "failes",
            message: err
        })
    }
}

const updateUsers = async (req, res) => {
  try {
    const data = req.body;

    // Logging the data to inspect the structure
    console.log('Received data:', data);

    // Check if guestList exists and is an array before accessing its length
    const guestListLength = Array.isArray(data.userData?.guestList) ? data.userData.guestList.length : 0;
    console.log('Guest List Length:', guestListLength);

    // Set Guest_Invited based on the length of guestList
    data.userData.Guest_Invited = guestListLength;

    // Perform the update in the database
    const ans = await userModel.findOneAndUpdate(
      { authToken: data.id },
      data.userData,
      { new: true } // Return the updated document
    );

    console.log('Update Result:', ans);

    res.json({ 
      status: "success",
      results: 1,
      updatedUser: ans
    });
  } catch (err) {
    console.error('Error in updateUsers:', err);

    res.status(500).json({
      status: "failed",
      message: "An error occurred while updating the user.",
      error: err.message
    });
  }
};


const deleteProducts = async (req, res) => {

    try {
        const ans = await productModel.deleteMany(
            { "title": req.params.title } || { "price": req.params.id, "title": req.params.title });
        res.json({
            status: "success",
            results: 1,
            message: ans
        })
    }
    catch (err) {
        res.json({
            status: "failed",
            results: 1,
            message: err
        })
    }
}



module.exports = {
    getUsers,
    verifyUsers,
    addUsers,
    replaceProduct,
    updateUsers,
    deleteProducts
}