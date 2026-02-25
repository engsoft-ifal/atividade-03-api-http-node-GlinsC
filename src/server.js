import http from "http";

let protocolos = [
    { id: 1, nome: 'gabriel', protocolo: 'solicitacao', data: '25/02/2026' },
    { id: 2, nome: 'pedro', protocolo: 'processo', data: '25/02/2026' }
]

const servidor = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/protocolos") {
        res.writeHead(200, { "Content-type": "application/json" })

        res.end(JSON.stringify({ protocolos }))
        return
    }

    if (req.method == "GET" && req.url === "/health") {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(JSON.stringify({ STATUS: 'OK' }))
        return
    }

    const partes = req.url.split('/')
    // ["", "protocolos", "1"]

    if (req.method === 'GET' && partes[1] === 'protocolos' && partes[2]) {

        const id = Number(partes[2])

        if (isNaN(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ mensagem: 'ID inválido' }))
            return
        }

        const item = protocolos.find(obj => obj.id === id)

        if (!item) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ mensagem: 'Registro não encontrado' }))
            return
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(item))
        return
    }



    if (req.method === "POST" && req.url === '/protocolos') {

        let body = ''

        //Lê os pedaços do body
        req.on('data', chunk => {
            body += chunk
        })

        // Quando terminar de ler o body
        req.on('end', () => {
            let dados

            // Tenta converter para JSON (JSON inválido → 400)
            try {
                dados = JSON.parse(body)
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ mensagem: 'JSON inválido' }))
                return
            }

            const { nome, tipo, data } = dados

            // Validação de campos obrigatórios (422)
            if (!nome || !tipo || !data) {
                res.writeHead(422, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ mensagem: 'Campos obrigatórios ausentes' }))
                return
            }

            // Cria ID incremental
            const novoProtocolo = {
                id: protocolos.length + 1,
                nome,
                tipo,
                data
            }

            // Armazena no array
            protocolos.push(novoProtocolo)

            // Retorna sucesso
            res.writeHead(201, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(novoProtocolo))

            //Comando usado: curl -X POST http://localhost:3000/protocolos -H "Content-Type: application/json" -d "{\"nome\":\"Vitor\",\"tipo\":\"Solicitação\",\"data\":\"25/02/2026"}"
        })
    }



}
)

servidor.listen(3000)

