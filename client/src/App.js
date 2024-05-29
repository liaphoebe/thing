import logoRise360 from './logo-rise-360.svg'
import logoRiseCom from './logo-rise-com.svg'
import './App.css'
import React, { useState, useEffect, useRef } from 'react';

function App() {

  const [data, setData] = useState(null);
  const save = useRef(false);

  useEffect(() => {
    fetch('http://localhost:5001/knowledge-check-blocks')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
 
  useEffect(() => {
    if (!data) return;
    if (!save) return;

    fetch('http://localhost:5001/uiStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(_ => save.current = false)
    .catch((err) => {
      console.error('Error:', err);
    })
  }, [data]);

  const submit = (questionId) => {
    let tmp = [];

    data.forEach(obj => {
      if (obj.questionId === questionId) {
        obj['submitted'] = true
      }
      tmp.push(obj)
    });
    save.current = true;
    setData(tmp)
  };

  const clear = (questionId) => {
    let tmp = [];

    data.forEach(obj => {
      if (obj.questionId === questionId) {
        obj['submitted'] = false
        obj['correctAnswer'] = false
        obj['answers'].forEach((ans) => {
          ans['selected'] = false
        })
        tmp.push(obj)
      }
    });

    save.current = true;
    setData(tmp);
  };

  const select = (questionId, answerId) => {
    let tmp = [];

    data.forEach(obj => {
      if (obj.questionId === questionId) {

        for (let answer of obj.answers) {
          if (answer.id === answerId) {
            answer['selected'] = true
            obj['correctAnswer'] = answer['isCorrect']
          } else {
            answer['selected'] = false
          }
        }    
      }
      tmp.push(obj)
    });

    save.current = true;
    setData(tmp);
  };

  const submittable = (questionId) => {
    const question = data.find(obj => obj.questionId === questionId)

    return question['answers'].some((ans) => ans['selected'])
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logoRiseCom} className="App-logo" alt="logo" />
        <div className='text-4xl text-center'>
          Julia's Tech Challenge with Articulate
        </div>
        <img src={logoRise360} className="App-logo" alt="logo" />
      </header>
      {data && data.map((question, _) =>
        <section key={question['questionId']} className='w-11/12 sm:w-10/12 md:w-9/12 lg:w-3/4  my-10 mx-auto'>
          <h1 className='text-5xl font-bold py-24'>Knowledge Check Block</h1>
          <div className="border border-gray-300 shadow-md">
            <div className='my-24 mx-36:sm mx-12'>
              <h1 className='text-3xl'>{question['text']}</h1>
              <br />
              <img src={question["url"]} alt="" />
              <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              <span>
                {question['answers']
                  .sort((a, b) => a.pos - b.pos)
                  .map((answer, _) =>
                    <div 
                      key={answer["id"]} 
                      className='flex items-center hover:bg-gray-100 px-10 cursor-pointer'
                      onClick={() => select(question['questionId'], answer["id"])}
                    >
                      <input 
                        id={answer["id"]} 
                        name="radio-option"
                        type="radio"
                        className='border-gray-300 h-4 w-4 border-2 rounded cursor-pointer text-gray-600'
                        onChange={() => select(question['questionId'], answer["id"])}
                        checked={answer["selected"]}
                        disabled={question['submitted']}
                      />
                      <label
                        className='text-2xl p-10 cursor-text'
                      >
                        {answer['text']}
                      </label>
                    </div>
                  )}
              </span>
              {!question['submitted'] && <div className='py-6'>
                <button
                  className='rounded-full bg-gray-500 text-white py-2 px-4 mx-auto block text-lg font-bold'
                  type='submit'
                  checked={question['submitted']}
                  onClick={() => submit(question.questionId)}
                  disabled={!submittable(question.questionId)}
                >
                  <h1 className='px-16 py-2'>SUBMIT</h1>
                </button>
              </div>}
              {question['submitted'] && <div>
                <div className='bg-gray-200 flex flex-col items-center m-6'>
                  {question['correctAnswer'] ? 
                    <div>
                      Correct!
                    </div>
                    :
                    <div>
                      Incorrect!
                    </div>
                  }
                  <br/>
                  <h1 className='text-lg'>{question['feedback']}</h1>
                </div>

                <button
                  className='py-2 px-4 mx-auto block text-lg font-bold'
                  type='submit'
                  checked={question['submitted']}
                  onClick={() => clear(question.questionId)}
                >
                  TAKE AGAIN
                </button>
              </div>
              }
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default App
