import { useState } from 'react';
import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string()
    .min(3)
    .required()
    .messages({
        'string.empty': 'Användarnamn är obligatoriskt.',
        'string.min': 'Användarnamn måste vara minst 3 tecken.',
    }),
    password: Joi.string()
    .min(7)
    .required()
    .messages({
        'string.empty': 'Lösenord är obligatoriskt.',
        'string.min': 'Lösenordet måste vara minst 7 tecken.',
    }),
});

export const CreateUser = () => {
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');


    const handleRegister = async () => {
        setMessage('');
        setNameError('');
        setPasswordError('');

      
        const { error } = userSchema.validate({ name, password });

        if (error) {
            error.details.forEach((detail) => {
                if ( name) {
                    setNameError(detail.message);
                }
                if (password) {
                    setPasswordError(detail.message);
                }
            });
            return; 
        }

        
        try {
            const response = await fetch('/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                setMessage(result.message);
            } else {
                setMessage('Användare skapad!');
                setName('');
                setPassword('');
            }
        } catch (error) {
            setMessage('Ett fel uppstod vid registrering.');
        }
    };

  // använder extract för att input ska få ett värde
    const validateName = () => {
        const { error } = userSchema.extract('name').validate(name);
        if (error) {
            setNameError(error.details[0].message);
        } else {
            setNameError(''); 
        }
    };

    
    const validatePassword = () => {
        const { error } = userSchema.extract('password').validate(password);
        if (error) {
            setPasswordError(error.details[0].message);
        } else {
            setPasswordError(''); 
        }
    };

    return (
        <div id="createuserContainer">
            <h2>Registrera dig</h2>
            <form onSubmit={handleRegister}>
                <label htmlFor="createusername">Användarnamn:</label>
                <input
                    type="text"
                    id="createusername"
                    placeholder="Ange användarnamn"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    onBlur={validateName} 
                    required
                />
                {nameError && <p style={{ color: 'red' }}>{nameError}</p>}

                <label htmlFor="createpassword">Lösenord:</label>
                <input
                    type="password"
                    id="createpassword"
                    placeholder="Ange lösenord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    onBlur={validatePassword} 
                    required
                />
                {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}

                <button type="submit">Registrera</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};