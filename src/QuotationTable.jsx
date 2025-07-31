import React from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TableFooter,
  InputAdornment
} from '@mui/material';
import { BsFillTrashFill } from 'react-icons/bs';

function QuotationTable({ data, deleteByIndex }) {
  if (!data || data.length === 0) {
    return (
      <Container>
  
      </Container>
    );
  }

  const calculateRowAmount = (item) => {
    const quantity = typeof item.qty === 'string' ? parseInt(item.qty, 10) : item.qty;
    const pricePerUnit = typeof item.ppu === 'string' ? parseFloat(item.ppu) : item.ppu;
    const discount = typeof item.discount === 'string' ? parseFloat(item.discount) : (item.discount || 0);

    return (quantity * pricePerUnit) - discount;
  };

  const calculateTotalDiscount = () => {
    return data.reduce((total, item) => {
      const discount = typeof item.discount === 'string' ? parseFloat(item.discount) : (item.discount || 0);
      return total + discount;
    }, 0);
  };

  const calculateFinalTotalAmount = () => {
    return data.reduce((total, item) => total + calculateRowAmount(item), 0);
  };

  const handleDelete = (index) => {
    deleteByIndex(index);
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      
        {/* Clear button is handled in App.jsx */}
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table aria-label="quotation table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center' }}>-</TableCell> {/* Delete action */}
              <TableCell sx={{ textAlign: 'center' }}>Qty</TableCell>
              <TableCell>Item</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Price/Unit</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Discount</TableCell> {/* New Discount Column */}
              <TableCell sx={{ textAlign: 'center' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={item.id || i}>
                <TableCell sx={{ textAlign: 'center' }}>
                  <BsFillTrashFill onClick={() => handleDelete(i)} style={{ cursor: 'pointer' }} />
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.qty}</TableCell>
                <TableCell>{item.item}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.ppu.toFixed(2)}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.discount !== undefined && item.discount !== null ? item.discount.toFixed(2) : '-'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{calculateRowAmount(item).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {/* First row for Total Discount */}
            <TableRow>
              {/* colSpan should cover all cells except the last two */}
              <TableCell colSpan={4} sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                Total Discount
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                {calculateTotalDiscount().toFixed(2)}
              </TableCell>
              <TableCell /> {/* Empty cell aligns with the 'Amount' column */}
            </TableRow>
            {/* Second row for Total Amount */}
            <TableRow>
              {/* colSpan should cover all cells except the last one */}
              <TableCell colSpan={5} sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                Total Amount
              </TableCell>
              <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                {calculateFinalTotalAmount().toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default QuotationTable;