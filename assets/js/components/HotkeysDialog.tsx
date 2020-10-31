import React from "react";
import { Badge, Modal, Table } from 'react-bootstrap';

export default function HotkeysDialog({ show, onHide }: { show: boolean, onHide: () => void }) {
  return <Modal show={show} onHide={onHide} >
    <Modal.Header closeButton>
      <Modal.Title>Hotkeys</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Table bordered>
        <thead>
          <tr>
            <th>Key</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Badge variant="light">shift+?</Badge></td>
            <td>Show hotkeys</td>
          </tr>
          <tr>
            <td><Badge variant="light">m</Badge></td>
            <td>Toggle mute</td>
          </tr>
          <tr>
            <td><Badge variant="light">v</Badge></td>
            <td>Toggle video</td>
          </tr>
          <tr>
            <td><Badge variant="light">shift+s</Badge></td>
            <td>Toggle shouting</td>
          </tr>
          <tr>
            <td><Badge variant="light">s</Badge></td>
            <td>Toggle settings</td>
          </tr>
        </tbody>
      </Table>
    </Modal.Body>
  </Modal >
}
