const FAQ = require("../Model/faqModel");

// Create a new FAQ (Admin)
exports.createFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ message: "Question and Answer are required" });
        }

        const newFAQ = await FAQ.create({ question, answer });
        res.status(201).json(newFAQ);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all FAQs (Admin/Internal)
exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find().sort({ createdAt: -1 });
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get matching answer (User) - Improved with keyword similarity
exports.getAnswer = async (req, res) => {
    try {
        const { question } = req.query;
        if (!question) {
            return res.status(400).json({ message: "Question is required" });
        }

        const faqs = await FAQ.find();
        const userInput = question.toLowerCase().trim();
        
        // Simple NLP: Tokenize and remove short common words (stopwords)
        const getKeywords = (text) => {
            return text.toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .split(/\s+/)
                .filter(word => word.length > 2); // Filter out words like 'a', 'the', 'is', 'to'
        };

        const userKeywords = getKeywords(userInput);
        if (userKeywords.length === 0) {
            return res.status(404).json({ message: "I'm sorry, I didn't catch that. Could you please provide more detail?" });
        }

        let bestMatch = null;
        let highestScore = 0;

        faqs.forEach(f => {
            const faqKeywords = getKeywords(f.question);
            // Calculate overlap
            const overlap = userKeywords.filter(word => faqKeywords.includes(word));
            const score = overlap.length / Math.max(userKeywords.length, faqKeywords.length);

            if (score > highestScore) {
                highestScore = score;
                bestMatch = f;
            }
        });

        // Threshold for a "good" match
        if (bestMatch && highestScore > 0.2) {
            return res.status(200).json({ answer: bestMatch.answer });
        } else {
            return res.status(404).json({ 
                message: "Sorry, I don't have an answer for that yet. Try asking about " + 
                         (faqs.length > 0 ? `'${faqs[0].question}'` : "other topics") + 
                         " or contact support." 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get FAQ Recommendations (User)
exports.getRecommendations = async (req, res) => {
    try {
        // Get 3-4 random questions
        const faqs = await FAQ.find().select('question');
        const shuffled = faqs.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4).map(f => f.question);
        
        res.status(200).json(selected);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an FAQ (Admin)
exports.updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;

        const updatedFAQ = await FAQ.findByIdAndUpdate(
            id,
            { question, answer },
            { new: true, runValidators: true }
        );

        if (!updatedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        res.status(200).json(updatedFAQ);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an FAQ (Admin)
exports.deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFAQ = await FAQ.findByIdAndDelete(id);

        if (!deletedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
