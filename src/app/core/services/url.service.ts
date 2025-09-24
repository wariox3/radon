import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from './cookie.service';
import { LOCALSTORAGE_KEYS } from '@app/core/constants/localstorage-keys.constant';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  // Base URLs
  private readonly baseUrl: string;
  private readonly apiSubdomain: string;
  private cookieService = inject(CookieService);

  constructor() {
    this.baseUrl = `${environment.protocolo}://${environment.dominio}`;
    // Create a template for subdomain URLs since apiSubdomain might not exist in environment
    this.apiSubdomain = `${environment.protocolo}://subdominio.${environment.dominio}`;
  }

  /**
   * Returns the base URL for the API (without subdomain)
   * @returns Base URL string
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Builds a complete URL with the base domain
   * @param endpoint The endpoint to append to the base URL
   * @returns Complete URL
   */
  buildBaseUrl(endpoint: string): string {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${this.baseUrl}/${normalizedEndpoint}`;
  }

  /**
   * Gets the current subdomain URL based on the stored subdomain
   * @returns Observable with the complete subdomain URL
   */
  getSubdomainUrl(): Observable<string> {
    const subdomain = this.cookieService.get(LOCALSTORAGE_KEYS.SUBDOMAIN);
    return of(`${environment.protocolo}://${subdomain}.${environment.dominio}`);
  }

  /**
   * Builds a URL with a specific subdomain
   * @param subdomain The subdomain to use
   * @returns Complete URL with the specified subdomain
   */
  buildSubdomainUrl(subdomain: string): string {
    return `${environment.protocolo}://${subdomain}.${environment.dominio}`;
  }

  /**
   * Builds a complete URL with the current subdomain
   * @param endpoint The endpoint to append to the subdomain URL
   * @returns Observable with the complete URL
   */
  buildCurrentSubdomainUrl(endpoint: string): Observable<string> {
    return this.getSubdomainUrl().pipe(
      map(subdomainUrl => {
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
        const normalizedBaseUrl = subdomainUrl.endsWith('/') ? subdomainUrl : `${subdomainUrl}/`;
        return `${normalizedBaseUrl}${normalizedEndpoint}`;
      })
    );
  }

  /**
   * Determines if a URL is complete (begins with http:// or https://)
   * @param url URL to check
   * @returns boolean indicating if it's a complete URL
   */
  isFullUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }
}
