import React from 'react';
import { render, fireEvent } from '../../utils/tests';
import { Input } from './Input';

describe('Input', () => {
  it('does render', () => {
    render(<Input label="Email" />);
  });

  it('Label and input are connected', async () => {
    const { findByLabelText } = render(<Input label="Email" />);

    const input = (await findByLabelText('Email')) as HTMLInputElement;
    expect(input.type).toBe('text');
    expect(input.tagName).toBe('INPUT');
  });

  it('can type into input', async () => {
    const { getByLabelText } = render(<Input label="Email" />);

    const input = getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test@test.de' } });
    expect(input.value).toBe('test@test.de');
  });
});
