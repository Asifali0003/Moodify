const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }


  this.password = await bcrypt.hash(this.password, 10);

  });

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;