// src/components/Budget.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';

const Budget = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Wedding Ceremony', cost: 2000, img: '/images/wedding_ceremony.jpg' },
    { id: 2, name: 'Reception', cost: 3000, img: '/images/reception.jpg' },
    { id: 3, name: 'Engagement Party', cost: 1000, img: '/images/engagement_party.jpg' },
    { id: 4, name: 'Bridal Shower', cost: 800, img: '/images/bridal_shower.jpg' },
    { id: 5, name: 'ABC Catering', cost: 1500, img: '/images/catering.jpg' },
    { id: 6, name: 'XYZ Photography', cost: 1200, img: '/images/photography.jpg' },
    { id: 7, name: 'Elegant Florists', cost: 700, img: '/images/florist.jpg' },
    { id: 8, name: 'Classic Musicians', cost: 600, img: '/images/musicians.jpg' },
    { id: 9, name: 'Luxurious Transportation', cost: 500, img: '/images/transportation.jpg' },
  ]);

  const [newItem, setNewItem] = useState({ name: '', cost: '' });

  // Calculate total cost
  const totalCost = items.reduce((total, item) => total + item.cost, 0);

  // Handle adding a new item
  const handleAddItem = () => {
    if (newItem.name && newItem.cost) {
      const id = items.length ? items[items.length - 1].id + 1 : 1;
      setItems([...items, { ...newItem, id }]);
      setNewItem({ name: '', cost: '' });
    }
  };

  // Handle removing an item
  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <Container className="animate__animated animate__fadeIn mt-5">
      <h2 className="text-center my-4">Budget Tracker</h2>
      
      {/* Add Item Form */}
      <Form>
        <Row className="align-items-end">
          <Col md={5}>
            <Form.Control
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              placeholder="Cost"
              value={newItem.cost}
              onChange={(e) => setNewItem({ ...newItem, cost: parseFloat(e.target.value) })}
            />
          </Col>
          <Col md={2}>
            <Button variant="primary" onClick={handleAddItem}>Add</Button>
          </Col>
        </Row>
      </Form>

      {/* Item List */}
      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Item</th>
            <th>Image</th>
            <th>Cost</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td><img src={item.img} alt={item.name} className="img-thumbnail" style={{ width: '100px' }} /></td>
              <td>${item.cost.toFixed(2)}</td>
              <td>
                <Button variant="danger" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Total Cost */}
      <h4 className="text-right mt-4">Total: ${totalCost.toFixed(2)}</h4>
    </Container>
  );
};

export default Budget;