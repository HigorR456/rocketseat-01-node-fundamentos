import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import { routePath } from "./utils/routePath.js"

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: routePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                id: search,
                title: search,
                description: search,
            } : null)

            return res.writeHead(200).end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: routePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            if (!title || !description) {
                return res.writeHead(404).end('Missing data')
            }

            const currentDate = new Date()

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: currentDate,
                updated_at: currentDate,
            }

            database.insert('tasks', task)
            
            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: routePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body
            const idExists = database.select('tasks', {
                id
            })

            if (idExists.length === 0 || !title || !description) {
                return res.writeHead(404).end('Missing data')
            }

            const currentDate = new Date()

            const task = {
                title,
                description,
                updated_at: currentDate
            }

            database.update('tasks', id, task)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: routePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const idExists = database.select('tasks', {
                id
            })

            if (idExists.length === 0) {
                return res.writeHead(404).end('Task not found')
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: routePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            const idExists = database.select('tasks', {
                id
            })

            if (idExists.length === 0) {
                return res.writeHead(404).end('Task not found')
            }

            const currentDate = new Date()

            database.update('tasks', id, {
                completed_at: currentDate
            })

            return res.writeHead(204).end()
        }
    },
]