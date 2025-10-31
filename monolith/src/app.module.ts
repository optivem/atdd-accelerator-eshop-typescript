import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EchoController, OrderController } from './api/controllers';
import { OrderService } from './core/services';
import { OrderRepository } from './core/repositories';
import { DummyJsonErpGateway } from './core/services/external';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, EchoController, OrderController],
  providers: [
    AppService,
    OrderService,
    OrderRepository,
    {
      provide: 'ErpGateway',
      useClass: DummyJsonErpGateway,
    },
  ],
})
export class AppModule {}
