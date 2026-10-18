"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let EventsGateway = class EventsGateway {
    server;
    logger = new common_1.Logger('EventsGateway');
    handleConnection(client) {
        const screen = client.handshake.query.screen;
        const tablet = client.handshake.query.tablet;
        if (screen) {
            client.join(screen);
            this.logger.log(`Cliente ${client.id} unido a sala (screen): ${screen}`);
        }
        else {
            this.logger.warn(`Cliente ${client.id} conectado sin especificar screen`);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Cliente desconectado: ${client.id}`);
    }
    handleEvent(data) {
        this.logger.log(`Evento recibido: ${JSON.stringify(data)}`);
        return 'Evento procesado correctamente';
    }
    sendToScreen(screen, payload) {
        this.logger.log(`Enviando datos a la pantalla: ${screen}`);
        this.logger.debug(`Payload: ${JSON.stringify(payload)}`);
        try {
            const payloadWithScreen = { ...payload, screen };
            const room = this.server.sockets.adapter.rooms.get(screen);
            if (room && room.size > 0) {
                this.server.to(screen).emit('newCustomisation', payloadWithScreen);
                this.logger.log(`Emitido a room ${screen} con ${room.size} cliente(s)`);
                return;
            }
            const socket = this.server.sockets.sockets.get(screen);
            if (socket) {
                this.logger.log(`Room vacío; enviando por socket id ${screen}`);
                socket.emit('newCustomisation', payloadWithScreen);
                return;
            }
            this.logger.warn(`No hay clientes en room ni socket con id ${screen}`);
            const connected = Array.from(this.server.sockets.sockets.keys()).slice(0, 20);
            this.logger.debug(`Sockets conectados (primeros 20): ${connected.join(',')}`);
        }
        catch (err) {
            this.logger.error(`Error al enviar a la pantalla ${screen}: ${err}`);
        }
    }
    closeScreenSession(screen) {
        this.logger.log(`Cerrando sesión para la pantalla: ${screen}`);
        try {
            const room = this.server.sockets.adapter.rooms.get(screen);
            if (room) {
                this.server.to(screen).emit('sessionClosed', { screen });
                this.logger.log(`Sesión cerrada para la pantalla: ${screen}`);
            }
        }
        catch (err) {
            this.logger.error(`Error al cerrar sesión para la pantalla ${screen}: ${err}`);
        }
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('events'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], EventsGateway.prototype, "handleEvent", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map