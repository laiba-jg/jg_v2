export const success = (res, data) => res.status(200).json(data);

export const created = (res) => res.status(201).json({ message: 'Created', key: '201' });

export const notFound = (res) => res.status(404).json({ message: 'Not Found', key: '404' });

export const internalServerError = (res) => res.status(500).json({ message: 'Internal Server Error', key: '500' });

export const noContent = (res) => res.status(204).send();

export const badRequest = (res, message) => res.status(400).json({ message });
