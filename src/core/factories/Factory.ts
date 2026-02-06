import { EnvironmentEnum } from "../environments/EnvironmentEnum";

type Constructor<T> = new (...args: any[]) => T;

interface Registration<T> {
    typeMap: Record<EnvironmentEnum, Constructor<T>>;
    deps?: string[]; // nomi delle dipendenze già registrate
}

export class Factory {
    private static instance: Factory;
    private registry = new Map<string, Registration<any>>();
    private resolvedInstances = new Map<string, any>();
    private currentEnv: EnvironmentEnum;

    private constructor(env: EnvironmentEnum) {
        this.currentEnv = env;
    }

    static initialize(env: EnvironmentEnum) {
        if (!Factory.instance) {
            Factory.instance = new Factory(env);
        }
        return Factory.instance;
    }

    static getInstance() {
        if (!Factory.instance) throw new Error("Factory not initialized");
        return Factory.instance;
    }

    register<T>(key: string, typeMap: Record<EnvironmentEnum, Constructor<T>>, deps?: string[]) {
        this.registry.set(key, { typeMap, deps });
    }

    resolve<T>(key: string): T {
        if (this.resolvedInstances.has(key)) return this.resolvedInstances.get(key);

        const reg = this.registry.get(key);
        if (!reg) throw new Error(`No registration for key ${key}`);

        const depInstances = reg.deps?.map((depKey) => this.resolve(depKey)) || [];
        const Type = reg.typeMap[this.currentEnv];
        const instance = new Type(...depInstances);

        this.resolvedInstances.set(key, instance);
        return instance;
    }
}
