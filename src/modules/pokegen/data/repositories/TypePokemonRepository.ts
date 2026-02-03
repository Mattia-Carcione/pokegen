import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { ITypePokemonRepository } from "@/modules/pokegen/domain/repositories/ITypePokemonRepository";
import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";
import { IPokemonRepository } from "@/modules/pokegen/domain/repositories/IPokemonRepository";
import { safeFetch } from "@/core/utils/async/SafeFetch";

/**
 * Repository per ottenere i Pokémon associati a un tipo.
 */
export class TypePokemonRepository implements ITypePokemonRepository {
  protected readonly className = "TypePokemonRepository";

  constructor(
    private readonly typeDataSource: IDataSource<TypeDto>,
    private readonly pokemonRepository: IPokemonRepository,
    private readonly cache: ICache<Pokemon[]>,
    private readonly logger: ILogger
  ) { }

  /**
   * Recupera i Pokémon associati a un tipo.
   * @param type - Il nome del tipo.
   */
  async getByTypeAsync(type: string): Promise<Pokemon[]> {
    const key = this.cache.generateKey(this.className, "getByTypeAsync", type);
    const cached = this.cache.get(key);
    if (cached) {
      this.logger.debug(`[${this.className}] - Pokémon per tipo trovati in cache: ${type}`);
      return cached;
    }

    this.logger.debug(`[${this.className}] - Cache miss, recupero Pokémon per tipo: ${type}`);
    const typeDto = await this.typeDataSource.fetchData(type);
    const task = typeDto.pokemon.map(async ({ pokemon }) => safeFetch(this.pokemonRepository.getAsync.bind(this.pokemonRepository), pokemon.url));

    const list = (await Promise.all(task)).filter(Boolean) as Pokemon[];
    const unique = Array.from(new Map(list.map((p) => [p.nameSpecies, p])).values());

    this.cache.set(key, unique, 1000 * 60 * 60);
    return unique;
  }
}
