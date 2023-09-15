import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import './about.scss';
import './req_score.css';
import { FetchingSchoProg } from '../../api/request';
import { useEffect, useState } from 'react';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useContext } from "react";
import { admininfo } from "../../App";
import FormControl from '@mui/material/FormControl';
import { CreatingScore,FetchingScore,ListAccess,ApplicationForm,QuestionForm,QuestionDelete,QuestionScore,
          EditFormQuestion,ChoiceDelete,ChoiceForm,ChoiceScore } from '../../api/request';
import Swal from 'sweetalert2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Card } from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material';
import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

const theme = createTheme();
const StyledBackdrop = styled(Backdrop)`
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`;

export const About = () => {
  const { loginUser,user } = useContext(admininfo);
    const [schoprog, setSchoProg] = useState([]);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const[formq,setFormq] = useState([]);
    const[formc,setFormc] = useState([]);
    const[schoname,setSchoname] = useState('');
    const [access,setAccess] = useState([])
    const [errors, setErrors] = useState({}); 
    const [scorelist, setScorelist] = useState([])
    const [accessList,setAccesslist] = useState([]);
    const [value, setValue] = useState('1');

    const handleTabChange = (event, newValue) => {
      setValue(newValue);
    };
  

    const handleChange = async (event) => {
      const value = await event.target.value;
      setSchoname(value);
      const schoname = value;
      setShowBackdrop(true);
     FetchingScore.FETCH_SCORECARD(schoname)
        .then(response => {
          const scorelist = response.data.ScholarScore;
          setScorelist(scorelist);
          setShowBackdrop(false);
        })
        .catch(error => {
          console.error(error);
        });
    };

    useEffect(() => {
      async function Fetch(){
        setShowBackdrop(true);
        const frm = await ApplicationForm.FETCH_FORM()
        const response = await FetchingSchoProg.FETCH_SCHOPROG()
        const res = await ListAccess.ACCESS()
        let acc = await ListAccess.ACCESS()
        const empacc = acc.data.result?.filter(data => data.employeeName === user.name)
        setAccess(empacc)
        setAccesslist(res.data.result[0])
        setFormq(frm.data.Questions)
        setFormc(frm.data.Answers)
        setSchoProg(response.data.SchoCat);
        setShowBackdrop(false);
      }
      Fetch();
    }, []);
console.log(access)
    const handleScorecardChange = (questionId, newScorecard) => {
      setFormq((prevQuestions) =>
      
        prevQuestions.map((question) =>
          question.id === questionId ? { ...question, scorecard: newScorecard } : question
        )
      );
    };
    const handleScorecardChange1 = (choiceid, newScorecard) => {
      setFormc((prevQuestions) =>
      
        prevQuestions.map((question) =>
          question.id === choiceid ? { ...question, scorecard: newScorecard } : question
        )
      );
    };
    const schoForm = formq?.filter(data => data.scholarshipProg === schoname)

    function filterChoicesByQuestionsId(choices, questionsId) {
      return choices?.filter((choice) => choice.questionsid === questionsId);
    }

    const allChoicesForQuestions = schoForm?.map((question) => {
      const choicesForQuestion = filterChoicesByQuestionsId(formc, question.id);
      return {
        question: question,
        choices: choicesForQuestion,
      };
    });
    const questions = allChoicesForQuestions?.map(item => item.question);
    const chosen = allChoicesForQuestions?.map(item => item.choices).flat();

    const AddQuestions = async() =>{
      const sections = access[0].sectionId.split(', '); 
      const isValueIncluded = sections.includes('Score Card');
      if(!isValueIncluded){
        Swal.fire({
          text: 'UnAuthorized Access',
          timer: 2000,
          buttons: false,
          icon: "error",
        })
        return
      }
      let optionsHtml = '';
      schoprog?.forEach((option) => {
        optionsHtml += `<option value="${option.name}">${option.name}</option>`;
      });
      const { value: formValues } = await Swal.fire({
        title: 'Add Questions',
        html:
        '<select id="swal-select" class="swal2-input">' +
        optionsHtml +
        '</select><br/>' +
          '<input id="swal-input2" class="swal2-input" placeholder="Question">',
        focusConfirm: false,
        confirmButtonText: 'Submit',
        showCancelButton:true,
        preConfirm: () => {
          const selectedValue = document.getElementById('swal-select').value;
          const question2 = document.getElementById('swal-input2').value;
    
          if (!selectedValue || !question2) {
            Swal.showValidationMessage('Both fields are required. Please enter data for both questions.');
            return false; // Prevent the dialog from closing
          }
          return [selectedValue, question2];
        },
      })
      if (formValues) {
        
        const selectedValue = formValues[0];
        const question2 = formValues[1];
        try {
          const formData = new FormData()
          formData.append('schoProg',selectedValue)
          formData.append('questions',question2)
          setShowBackdrop(true);
          await QuestionForm.Q_FORM(formData)
          .then((res) =>{
            setFormq(res.data.Questions)
            setFormc(res.data.Answers)
            setShowBackdrop(false);
          })
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('User did not confirm or did not input data for both questions.');
      }

    }
    const AddChoices = async(data) =>{
      const { value: choice } = await Swal.fire({
        title: 'Enter Choices you want to Add',
        input: 'text',
        confirmButtonText: 'Add',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!'
          }
        }
      })
      
      if (choice) {
        const formData = new FormData()
        formData.append('questionsid',data.id)
        formData.append('choice',choice)
        setShowBackdrop(true)
        await ChoiceForm.C_FORM(formData)
        .then((res) =>{
          setFormq(res.data.Questions)
          setFormc(res.data.Answers)
          setShowBackdrop(false);
        })
      }
    }
    const DeleteQuestion = async(data) =>{
      
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true
      }).then(async(result) => {
        if (result.isConfirmed) {
          const id = data.id
          setShowBackdrop(true)
          await QuestionDelete.DELETE_QFORM(id)
          .then((res) =>{
            setFormq(res.data.Questions)
            setFormc(res.data.Answers)
            setShowBackdrop(false);
          })
          Swal.fire(
            'Deleted!',
            'The Selected Question has been deleted.',
            'success'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire(
            'Cancelled',
            'The Selected Question deletion has cancelled. :)',
            'error'
          )
        }
      })      
    }
    const DeleteChoice = async(data) =>{
      
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true
      }).then(async(result) => {
        if (result.isConfirmed) {
          const id = data.id
          setShowBackdrop(true)
          await ChoiceDelete.DELETE_CFORM(id)
          .then((res) =>{
            setFormq(res.data.Questions)
            setFormc(res.data.Answers)
            setShowBackdrop(false);
          })
          Swal.fire(
            'Deleted!',
            'The Selected Item has been deleted.',
            'success'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire(
            'Cancelled',
            'The Selected Item deletion has cancelled. :)',
            'error'
          )
        }
      })      
    }
    const EditQForm = async(data) =>{
      const { value: question } = await Swal.fire({
        title: 'Enter Question you want to Replace/Edit',
        input: 'text',
        confirmButtonText: 'Save Changes',
        showCancelButton: true,
        inputValue: data.questions,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!'
          }
        }
      })
      
      if (question) {
        const formData = new FormData()
        formData.append('id',data.id)
        formData.append('questions',question)
        setShowBackdrop(true)
        await EditFormQuestion.EDIT_FORMQ(formData)
        .then((res) =>{
          setFormq(res.data.Questions)
          setFormc(res.data.Answers)
          setShowBackdrop(false);
        })
      }     
    }
    const SaveScore = async() =>{
      const istotal = await CheckScore()
      if(istotal > 100){
        Swal.fire(
          'Reminders!',
          'Total score cannot be greater than or equal to 100',
          'warning'
        )
        return
      }
      if(istotal < 100){
        Swal.fire(
          'Reminders!',
          'Total score must equal to 100',
          'warning'
        )
        return
      }
      const checkchoice = formc.filter(data => data.scorecard > 100 || data.scorecard < 0)
      if(checkchoice.length > 0){
        Swal.fire(
          'Reminders!',
          'The percent of individual choices must between 0 to 100 only',
          'warning'
        )
        return
      } 
      setShowBackdrop(true);
      try {
        const questionScoresPromises = questions.map((data) => {
          const formData = new FormData();
          formData.append('score', data.scorecard);
          formData.append('id', data.id);
          return QuestionScore.Q_SCORE(formData);
        }); 
    
        const choiceScoresPromises = chosen.map((datac) => {
          const formData = new FormData();
          formData.append('score', datac.scorecard);
          formData.append('id', datac.id);
          return ChoiceScore.C_SCORE(formData);
        });

        const [questionScores, choiceScores] = await Promise.all([
          Promise.all(questionScoresPromises),
          Promise.all(choiceScoresPromises),
        ]);

        if (questionScores.length > 0) {
          setFormq(questionScores[questionScores.length - 1].data.Questions);
        } else {
          console.error('Error: questionScores is empty');
        }
    
        if (choiceScores.length > 0) {
          setFormc(questionScores[questionScores.length - 1].data.Answers);
        } else {
          console.error('Error: choiceScores is empty');
        }
    
        setShowBackdrop(false);
        Swal.fire('Success!', 'Successfully Set the Score Card.', 'success');
      } catch (error) {
        setShowBackdrop(false);
        Swal.fire('Error!', 'An error occurred while saving the score.', 'error');
      }
    }
    const CheckScore = async() =>{
      let total = 0;
      for(let j=0 ;j<schoForm.length;j++){
        total += parseFloat(schoForm[j].scorecard);
      }
      return total
    }

    const FormTemplate = questions?.map((data,index) =>{
      const choices = chosen?.filter(data1 => data1.questionsid === data.id)
      return(
        <div key={index} className='questionchoose'>
          <div className='questioncon'>
          <p style={{overflow:'hidden'}}>
          {index + 1}. {data.questions}
          </p> 
          <div style={{display:'flex',whiteSpace:'nowrap'}}>
          <button style={{padding:'5px',height:'32px'}} className='myButton1' onClick={() =>EditQForm(data)}><EditIcon sx={{fontSize:'13px'}}/></button>
          <button style={{padding:'5px',marginLeft:'10px',height:'32px'}} onClick={() =>DeleteQuestion(data)} className='myButton2'><DeleteIcon sx={{fontSize:'13px'}}/></button>
          </div>

          </div>
          <ul>
            {choices?.map((data1,index) =>{
              return(
                <li className='choiceli' key={index}>
                 <p style={{overflow:'hidden'}}>- {data1.value}</p> 
                <button onClick={() =>DeleteChoice(data1)} style={{padding:'5px',marginLeft:'10px',height:'32px'}} className='myButton2'>
                  <DeleteIcon sx={{fontSize:'13px'}}/>
                </button></li>
              )
            })}
          </ul>
          <div className='addchoice'><button className='myButton1' onClick={() =>AddChoices(data)}>+Add Choices</button></div>
        </div>
      )
    })
    const ScoreTemplate = questions?.map((data,index) =>{
      const choices = chosen?.filter(data1 => data1.questionsid === data.id)
      return(
        <div key={index} className='questionchoose'>
          <p className='questcon'>{index + 1}. {data.questions}
          <span style={{marginLeft:'15px'}}>
            <input
            className='scoreinput'
            type="text"
            value={data.scorecard}
            onChange={(e) => handleScorecardChange(data.id, e.target.value)}
            />
          </span>
          </p>
          <ul>
            {choices?.map((data1,index) =>{
              return(
                <li className='choiceli' key={index}>
                  - {data1.value}
                  <span>
                    <input
                    className='scoreinput'
                    type="text"
                    value={data1.scorecard}
                    onChange={(e) => handleScorecardChange1(data1.id, e.target.value)}
                    />
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )
    })

  return (
    <>
              <StyledBackdrop open={showBackdrop}>
                <CircularProgress color="inherit" />
              </StyledBackdrop>
    <div className="about">
        <Sidebar/>
        <div className="aboutContainer">
        <Navbar/>
        <div className="top">
          <h1>Score Card</h1>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Scholarship Program</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={schoname}
              label="Scholarship Program"
              onChange={handleChange}
            >
              {schoprog?.map((data,index) =>{
                return(
                  <MenuItem key={index}  value={data.name}>{data.name}</MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <Tabs
            value={value}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab value="1" label="Application Form" />
            <Tab value="2" label="Score Card" />
          </Tabs>
          {value === '1' && 
         <Card sx={{padding:'10px',backgroundColor:'transparent'}} elevation={0}>
            <button style={{float:'right'}} onClick={AddQuestions} className='myButton1'>Add Questions</button>
            <div className="frmcontainer">
            {FormTemplate}
            </div>

          </Card> }   
          {value === '2' && 
         <Card sx={{padding:'10px',backgroundColor:'transparent'}} elevation={0}>
                    This Score Card will apply to the Scholarship Application Form
          <p>Instructions:</p>
          <p>1.Set the Score for each questions where in the score is equivalent to percentage </p>
          <p>2.All the Questions must the total value is equivalent to 100 when each questions is sum up </p>
          <p>3.All the CHOICE must a value is not greater than to 100 or less than 0 </p>
          <p>4.The Choices will be the percentage of a questions</p>
          <p>5.Formula: Percentage of Selected Choice divided by 100 times the Specific Questions</p>
            <button style={{float:'right',marginBottom:'10px'}} onClick={SaveScore} className='myButton1'>Set Score</button>
              {ScoreTemplate}
         </Card> }       
        </div>
        </div>

         
    </div>
    </>
  )
}
