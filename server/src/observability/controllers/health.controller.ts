import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { Public } from "src/common/guards/roles.decorator";


@Controller("health")
export class HealthController {
    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    healthCheck() {
        return { status: 'ok' };
    }
}