import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Form from 'react-bootstrap/Form';
import { Button,Box } from '@mui/material';
import './payroll.css'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0047a4",
    color: theme.palette.common.white,

  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,

  },
}));
const tableContainerStyle = {
  maxHeight: 'maxContent',
  borderRadius: '0', 
};

function Payroll(pay){
  const [payroll,setPayroll] = useState([])
  const [tabs,setTabs] = useState(0)
  const [selection,setSelection] = useState('')
  const [total,setTotal] = useState('')
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() =>{

      if(selection === 'Elementary'){
        const Elementary = pay.data.elementary.scholarList;
        setPayroll(Elementary)
      }
      if(selection === 'Highschool'){

        const Highschool = pay.data.highSchool.scholarList;
        setPayroll(Highschool)
      }
      if(selection === 'College'){
        const College = pay.data.college.scholarList;
        setPayroll(College)
      }
  },[payroll,selection])

  function convertToPesos(number) {
    return isNaN(number) ? "Invalid Number" : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(number);
  }

  const columns = [
    { field: 'userNum', headerName: '#', width: 70,  align: 'left', },
    { field: 'Name', headerName: 'Name', width: 200,  align: 'left', },
    { field: 'InclusiveDate', headerName: 'Inclusive Date', width: 170,  align: 'left', },
    {
      field: 'January',
      headerName: 'January',
      width: 100,
      format: (value) => convertToPesos(value),
      align: 'left',
    },
    {
      field: 'February',
      headerName: 'February',
      width: 100,
      format: (value) => convertToPesos(value),
      align: 'left',
    },
    {
      field: 'March',
      headerName: 'March',
      width: 100,
      format: (value) => convertToPesos(value),
      align: 'left',
    },
    {
      field: 'April',
      headerName: 'April',
      width: 100,
      format: (value) => convertToPesos(value),
      align: 'left',
    },
    {
      field: 'May',
      headerName: 'May',
      width: 100,
      format: (value) => convertToPesos(value),
      align: 'left',
    },
    {
      field: 'AmountDue',
      headerName: 'Amount Due',
      width: 130,
      format: (value) => convertToPesos(value),
      align: 'left',
    },
  ];


  const calculateTotalAmount = (month) => {
    return payroll.reduce((total, user) => total + user[month], 0);
  };

  const totalRow = {
    id: 'total',
    scholarCode: 'Total',
    Name: '',
    InclusiveDate: '',
    January: convertToPesos(calculateTotalAmount('January')),
    February: convertToPesos(calculateTotalAmount('February')),
    March: convertToPesos(calculateTotalAmount('March')),
    April: convertToPesos(calculateTotalAmount('April')),
    May: convertToPesos(calculateTotalAmount('May')),
    AmountDue: convertToPesos(payroll.reduce((total, user) => total + user.AmountDue, 0)),
  };

  const modifiedList = payroll.map((item, index) => ({
    ...item,
    userNum: index + 1,

  }));

  return (
    <div className='payrollContent'>

      <div className='payrollContainer2'>
          <div>
          <Form.Select aria-label="Default select example"
            value={selection}
            onChange={(e) => setSelection(e.target.value)}
          >
            <option>Select Year Level</option>
            <option value="Elementary">Elementary</option>
            <option value="Highschool">Highschool</option>
            <option value="College">College</option>
          </Form.Select>
          </div>
          <div>
            <Button sx={{color:'white',textTransform:'none'}} onClick={handlePrint} className='myButton'>Print</Button>
          </div>
      </div>
      <div className='payrollTable'>
      <Paper sx={{ width: '100%',height:'maxContent',borderRadius:'0px' }}>
      <TableContainer sx={tableContainerStyle}>
        <Table stickyHeader>
          <TableHead sx={{borderRadius:'5px 5px 0px 0px',backgroundColor:'black'}}>
            <TableRow >
              {columns.map((column) => (
                <StyledTableCell
                  key={column.field}
                  align={column.align}
                  style={{ minWidth: column.width, position: 'sticky', top: 0, zIndex: 1000 }}
                >
                  {column.headerName}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {modifiedList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.scholarCode}>
                    {columns.map((column) => {
                      const value = row[column.field];
                      return (
                        <TableCell key={column.field} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}

          </TableBody>
        </Table>
      </TableContainer>
      <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px', fontWeight: 'bold' }}>
        {columns.map((column) => (
          <span key={column.field} style={{ minWidth: column.width,paddingLeft:'15px' }}>
            {totalRow[column.field]}
          </span>
        ))}
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={payroll.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
      </div>
    </div>
  )
}

export default Payroll