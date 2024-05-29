const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const knex = require('./knex')

const getKnowledgeCheckBlocks = (req, res) =>

  knex.select('knowledgeCheckBlocks.*', 'questions.*', 'media.*', 
    knex.raw(`json_agg(
      json_build_object(
        'id', "answers"."id",
        'isCorrect', "answers"."isCorrect",
        'pos', "answers"."pos",
        'text', "answers"."text",
        'selected', "answers"."selected"
      )
    ) as answers`))
    .from('knowledgeCheckBlocks')
    .join('questions', 'questionId', '=', 'questions.id')
    .join('media', 'mediaId', '=', 'media.id')
    .leftJoin('answers', 'knowledgeCheckBlocks.id', '=', 'knowledgeCheckBlockId')
    .groupBy('knowledgeCheckBlocks.id', 'questions.id', 'media.id')
    .then(res.send.bind(res));

const postUIStatus = async (req, res) => {

  for (let obj of req.body) {

    console.log(obj)

    const { questionId, submitted, correctAnswer, answers } = obj;

    const question = await knex('questions').where({ id: questionId }).first();

    if (!question) {
      return res.status(400).json({ error: 'Invalid questionid' })
    }

    await knex('questions')
      .where({ id: questionId })
      .update({ submitted: submitted, correctAnswer: correctAnswer })

    for (let answer of answers) {
      await knex('answers').where({ id: answer.id }).update({ selected: answer['selected'] })
    }
  }

  res.send({success: true});
};

function server() {
  const app = express()
  const port = 5001

  app.use(morgan('dev'))
  app.use(cors())
  app.use(express.json());

  app.get('/knowledge-check-blocks', getKnowledgeCheckBlocks)
  app.post('/uiStatus', postUIStatus)

  app.start = app.listen.bind(app, port, () => console.log(`Listening on port ${port}`))

  return app
}

if (require.main === module) server().start()

module.exports = server
