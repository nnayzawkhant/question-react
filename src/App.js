
import './App.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
let result = []

function App() {
  const [datas, setDatas] = useState([])
  const [step, setStep] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [lastBtn, setLastBtn] = useState(false)

  const fetchData = async () => {
    const newData = await axios.get(`http://localhost:5000/datas`);
    setDatas(newData.data)
  }

  useEffect(() => {
    fetchData()
  }, [])
  // console.log(datas[1].question)

  const next = () => {
    setStep(prev => prev + 1)
  }

  const prev = () => {
    if(step !== 0) {
      setStep(prev => prev - 1)
      backPercentage(step)
    } else {
      alert("hello")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step !== datas.length - 1) {
      next()
      checkPercentage(step)
      
    } else {
      checkPercentage(step)
      setLastBtn(true)
    }
  }

  const checkPercentage = (step) => {
    if (datas[step].answer === result[step].ans) {
      setPercentage(percentage + 1)
      console.log(`correct ${percentage} in ${datas.length}`)
    }
  }

  const backPercentage = (step) => {
    if (datas[step-1]?.answer === result[step-1]?.ans) {
      setPercentage(percentage - 1)
      console.log(`correct ${percentage} in ${datas.length}`)
    }
  }


  const addAnswer = (e, id, step) => {
    result[step] = {id: id, ans: e.target.value}
  }

  const goBack = (e) => {
    e.preventDefault();
    prev()
  }

  const playAgain = () => {
    setStep(0)
    result = []
    setPercentage(0)
    setLastBtn(false)
  }

  return (
    <div className='app'>
      <form onSubmit={handleSubmit}>
        <h1>Question</h1>
        <p>{step + 1}/{datas.length}</p>

        <div className='container'>
          <h3>{datas[step]?.question}</h3>
          { 
            datas[step]?.options.map(option => (
              <label className="btn" key={option}>
                <input type="radio" className='text'
                name={datas[step]?.question} value={option} onChange={e => addAnswer(e, datas[step]?.id, step)} required/>
                {option}
              </label>
            ))
          }
          {
            step !== 0 && <button  onClick={e => goBack(e)}>Back</button>
          }
          
        <button className='next' type='submit'>
          { step < (datas.length - 1) ? 'Next Question >': 'Submit' }
        </button>
        </div>
        
        
      </form>
          {
            lastBtn && <section className='footer'>
              <div className='card'>
                <h2>
                  {percentage >= 5 && 'Good'}
                  {percentage < 5 && 'Bad'}
                </h2>
                
                
                <h3>You Answered</h3>
                <h1>{percentage}/ {datas.length}</h1>
                <p>Question Correct</p>
                <button className='play' onClick={() => playAgain()}>Play Again</button>
              </div>
            </section>
          }
        
    </div>
  );
}

export default App;
