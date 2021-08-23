import { SentryModuleOptions, SentryOptionsFactory } from "../sentry.interfaces";
import { LogLevel } from "@sentry/types";
import { Test } from "@nestjs/testing";
import { SentryModule } from "../sentry.module";
import { SentryService } from "../sentry.service";
import { SENTRY_TOKEN } from "../sentry.constants";

import * as Sentry from '@sentry/node';
import { ConsoleLogger } from '@nestjs/common';
jest.spyOn(Sentry, 'close')
  .mockImplementation(() => Promise.resolve(true));
const mockCloseSentry = Sentry.close as jest.MockedFunction<typeof Sentry.close>;

describe('SentryService', () => {
    let logger = new ConsoleLogger('SentryServiceSpec');

    let config: SentryModuleOptions = {
        dsn: 'https://45740e3ae4864e77a01ad61a47ea3b7e@o115888.ingest.sentry.io/25956308132020',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
        logger
    };

    let configWithNoLogger: SentryModuleOptions = {
        dsn: 'https://45740e3ae4864e77a01ad61a47ea3b7e@o115888.ingest.sentry.io/25956308132020',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
        logger: null
    };

    let failureConfig: SentryModuleOptions = {
        dsn: 'https://sentry_io_dsn@sentry.io/1512xxx',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
        logger
    };

    let failureConfigNoLogger: SentryModuleOptions = {
        dsn: 'https://sentry_io_dsn@sentry.io/1512xxx',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
        logger: null
    };

    class TestService implements SentryOptionsFactory {
        createSentryModuleOptions(): SentryModuleOptions {
            return config;
        }
    }

    class TestServiceNoLogging implements SentryOptionsFactory {
        createSentryModuleOptions(): SentryModuleOptions {
            return configWithNoLogger;
        }
    }

    class FailureService implements SentryOptionsFactory {
        createSentryModuleOptions(): SentryModuleOptions {
            return failureConfig;
        }
    }

    class FailureServiceNoLogging implements SentryOptionsFactory {
        createSentryModuleOptions(): SentryModuleOptions {
            return failureConfigNoLogger;
        }
    }

    /* describe('sentry.integrations', () => {
        it('should cause Sentry.Integrations.OnUncaughtException', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRoot(failureConfig)
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            console.log('inside failure');
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
        })
    }) */

    describe('sentry.log:error', () => {
        it('should provide the sentry client and call log', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: FailureService
                    })
                ]
            }).compile();

            const fail = mod.get<SentryService>(SENTRY_TOKEN);
            /// expect(sentry).toBeDefined();
            // expect(sentry).toBeInstanceOf(SentryService);
            console.log('sentry:error', fail);
            fail.log('sentry:log');
            expect(fail.log).toBeInstanceOf(Function);
        });

        it('should provide the sentry client and call log with disabled logging', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: FailureServiceNoLogging
                    })
                ]
            }).compile();

            const fail = mod.get<SentryService>(SENTRY_TOKEN);
            /// expect(sentry).toBeDefined();
            // expect(sentry).toBeInstanceOf(SentryService);
            console.log('sentry:error', fail);
            fail.log('sentry:log');
            expect(fail.log).toBeInstanceOf(Function);
        });
    });

    describe('sentry.log', () => {
        it('should provide the sentry client and call log', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestService
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            console.log('sentry', sentry);
            sentry.log('sentry:log');
            expect(sentry.log).toBeInstanceOf(Function);
        });

        it('should provide the sentry client and call log with disabled logging', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestServiceNoLogging
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            console.log('sentry', sentry);
            sentry.log('sentry:log');
            expect(sentry.log).toBeInstanceOf(Function);
        });
    });

    describe('sentry.error', () => {
        it('should provide the sentry client and call error', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestService
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            // console.log('sentry', sentry);
            sentry.error('sentry:error');
            expect(sentry.error).toBeInstanceOf(Function);
        });

        it('should provide the sentry client and call error with disabled logging', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestServiceNoLogging
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            // console.log('sentry', sentry);
            sentry.error('sentry:error');
            expect(sentry.error).toBeInstanceOf(Function);
        });
    });

    describe('sentry.verbose', () => {
        it('should provide the sentry client and call verbose', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestService
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            // console.log('sentry', sentry);
            sentry.verbose('sentry:verbose','context:verbose');
            expect(sentry.verbose).toBeInstanceOf(Function);
        });

        it('should provide the sentry client and call verbose with disabled logging', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestServiceNoLogging
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            // console.log('sentry', sentry);
            sentry.verbose('sentry:verbose','context:verbose');
            expect(sentry.verbose).toBeInstanceOf(Function);
        });
    });

    describe('sentry.debug', () => {
        it('should provide the sentry client and call debug', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestService
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            // console.log('sentry', sentry);
            sentry.debug('sentry:debug','context:debug');
            expect(sentry.debug).toBeInstanceOf(Function);
        });

        it('should provide the sentry client and call debug with disabled logging', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestServiceNoLogging
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            // console.log('sentry', sentry);
            sentry.debug('sentry:debug','context:debug');
            expect(sentry.debug).toBeInstanceOf(Function);
        });
    });

    describe('sentry.warn', () => {
        it('should provide the sentry client and call warn', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestService
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            // console.log('sentry', sentry);
            sentry.warn('sentry:warn','context:warn');
            expect(sentry.warn).toBeInstanceOf(Function);
        });

        it('should provide the sentry client and call warn with disabled logging', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestServiceNoLogging
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            // console.log('sentry', sentry);
            sentry.warn('sentry:warn','context:warn');
            expect(sentry.warn).toBeInstanceOf(Function);
        });
    });

    describe('sentry.close', () => {
        it('should not close the sentry if not specified in config', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot(config)],
            }).compile();
            await mod.enableShutdownHooks();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            await mod.close();
            expect(mockCloseSentry).not.toHaveBeenCalled();
        });

        it('should close the sentry if specified in config', async() => {
            const timeout = 100;
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...config,
                    close: {
                        enabled: true,
                        timeout
                    }
                })],
            }).compile();
            await mod.enableShutdownHooks();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            await mod.close();
            expect(mockCloseSentry).toHaveBeenCalledWith(timeout);
        });
    });
    
});