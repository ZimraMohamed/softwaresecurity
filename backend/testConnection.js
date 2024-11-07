mongoose.connect('mongodb://127.0.0.1:27017/softwaresecurity', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((error) => console.log('MongoDB connection error:', error));
