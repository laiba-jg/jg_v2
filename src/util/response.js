export const success = (res, data) => res.status(200).json(data || {});

export const created = (res, data = null) => res.status(201).json(data || { message: 'Created', key: '201' });

export const notFound = (res) => res.status(404).json({ message: 'Not Found', key: '404' });

export const internalServerError = (res) => res.status(500).json({ message: 'Internal Server Error', key: '500' });

export const noContent = (res) => res.status(204).send();

export const badRequest = (res, message) => res.status(400).json(message);

export const forbidden = (res) => res.status(403).json({ message: 'No permission to access this resource', key: '403' });

export const unauthorised = (res) => res.status(401).json({ message: 'Unauthorized', key: '401' });

export const conflict = (res) => res.status(409).json({ message: 'Record already exists', key: '409' });
