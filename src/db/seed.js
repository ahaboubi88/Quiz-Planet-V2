/**
 * Seed script — Inserts sample quiz if database is empty
 */

const { getDb } = require('./database');
const { isCurrentlyDemo } = require('../utils/status');

async function seedDatabase() {
    const db = getDb();

    // Check if quizzes already exist
    const count = await db.prepare('SELECT COUNT(*) as count FROM quizzes').get();
    if (count.count > 0) {
        console.log('  ℹ Database has quizzes, skipping seed');
        return;
    }

    // Insert sample quiz
    const insertQuiz = db.prepare(
        'INSERT INTO quizzes (title, description, language) VALUES (?, ?, ?)'
    );

    const insertQuestion = db.prepare(
        'INSERT INTO questions (quiz_id, type, text, time_limit, points, order_index) VALUES (?, ?, ?, ?, ?, ?)'
    );

    const insertAnswer = db.prepare(
        'INSERT INTO answers (question_id, text, is_correct, order_index, color) VALUES (?, ?, ?, ?, ?)'
    );

    const seedTransaction = db.transaction(async () => {
        // --- QUIZ 1: General Knowledge (English) ---
        const quizEn = await insertQuiz.run('General Knowledge Quiz', 'A fun quiz for ages 10-12 covering general knowledge topics', 'en');
        const quizIdEn = quizEn.lastInsertRowid;

        const questionsEn = [
            {
                text: 'What is the capital of France?',
                timeLimit: 20,
                answers: [
                    { text: 'Paris', correct: true, color: 'red' },
                    { text: 'London', correct: false, color: 'blue' },
                    { text: 'Berlin', correct: false, color: 'yellow' },
                    { text: 'Madrid', correct: false, color: 'green' }
                ]
            },
            {
                text: 'What is 7 × 8?',
                timeLimit: 15,
                answers: [
                    { text: '48', correct: false, color: 'red' },
                    { text: '56', correct: true, color: 'blue' },
                    { text: '64', correct: false, color: 'yellow' },
                    { text: '42', correct: false, color: 'green' }
                ]
            },
            {
                text: 'Which planet is closest to the Sun?',
                timeLimit: 20,
                answers: [
                    { text: 'Venus', correct: false, color: 'red' },
                    { text: 'Earth', correct: false, color: 'blue' },
                    { text: 'Mercury', correct: true, color: 'yellow' },
                    { text: 'Mars', correct: false, color: 'green' }
                ]
            },
            {
                text: 'How many continents are there?',
                timeLimit: 15,
                answers: [
                    { text: '5', correct: false, color: 'red' },
                    { text: '7', correct: true, color: 'blue' },
                    { text: '6', correct: false, color: 'yellow' },
                    { text: '8', correct: false, color: 'green' }
                ]
            }
        ];

        // --- QUIZ 2: General Knowledge (Arabic) ---
        const quizAr = await insertQuiz.run('اختبار معلومات عامة', 'اختبار ممتع يغطي مواضيع المعرفة العامة', 'ar');
        const quizIdAr = quizAr.lastInsertRowid;

        const questionsAr = [
            {
                text: 'ما هي عاصمة فرنسا؟',
                timeLimit: 20,
                answers: [
                    { text: 'باريس', correct: true, color: 'red' },
                    { text: 'لندن', correct: false, color: 'blue' },
                    { text: 'برلين', correct: false, color: 'yellow' },
                    { text: 'مدريد', correct: false, color: 'green' }
                ]
            },
            {
                text: 'ما هو حاصل ضرب 7 × 8؟',
                timeLimit: 15,
                answers: [
                    { text: '48', correct: false, color: 'red' },
                    { text: '56', correct: true, color: 'blue' },
                    { text: '64', correct: false, color: 'yellow' },
                    { text: '42', correct: false, color: 'green' }
                ]
            },
            {
                text: 'أي كوكب هو الأقرب إلى الشمس؟',
                timeLimit: 20,
                answers: [
                    { text: 'الزهرة', correct: false, color: 'red' },
                    { text: 'الأرض', correct: false, color: 'blue' },
                    { text: 'عطارد', correct: true, color: 'yellow' },
                    { text: 'المريخ', correct: false, color: 'green' }
                ]
            },
            {
                text: 'كم عدد القارات في العالم؟',
                timeLimit: 15,
                answers: [
                    { text: '5', correct: false, color: 'red' },
                    { text: '7', correct: true, color: 'blue' },
                    { text: '6', correct: false, color: 'yellow' },
                    { text: '8', correct: false, color: 'green' }
                ]
            }
        ];

        // Function to insert a quiz's questions
        const insertQuizData = async (quizId, questions) => {
            // Apply demo limit on seeding as well just to be safe, although we hardcoded 4 here anyway
            const limit = (await isCurrentlyDemo()) ? Math.min(questions.length, 4) : questions.length;
            for (let index = 0; index < limit; index++) {
                const q = questions[index];
                const result = await insertQuestion.run(quizId, 'mc', q.text, q.timeLimit, 1000, index);
                const questionId = result.lastInsertRowid;

                for (let aIndex = 0; aIndex < q.answers.length; aIndex++) {
                    const a = q.answers[aIndex];
                    await insertAnswer.run(questionId, a.text, a.correct ? 1 : 0, aIndex, a.color);
                }
            }
        };

        await insertQuizData(quizIdEn, questionsEn);
        await insertQuizData(quizIdAr, questionsAr);
    });

    await seedTransaction();
    console.log('  ✔ Sample quizzes seeded (English & Arabic)');
}

module.exports = { seedDatabase };
