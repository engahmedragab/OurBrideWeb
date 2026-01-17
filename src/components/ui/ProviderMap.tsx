'use client'

import { useEffect, useRef, useState } from 'react'
import type { FeaturedProviderResponse } from '@/types/responses'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

// Google Maps API types
interface GoogleMapsLatLng {
    lat(): number
    lng(): number
}

interface GoogleMapsMap {
    panTo(latLng: GoogleMapsLatLng): void
    panBy(x: number, y: number): void
}

interface GoogleMapsOverlayView {
    getPanes(): {
        overlayLayer: HTMLElement
    }
    getProjection(): {
        fromLatLngToDivPixel(latLng: GoogleMapsLatLng): { x: number; y: number } | null
    } | null
    setMap(map: GoogleMapsMap | null): void
}

interface GoogleMaps {
    maps: {
        Map: new (element: HTMLElement, options?: Record<string, unknown>) => GoogleMapsMap
        LatLng: new (lat: number, lng: number) => GoogleMapsLatLng
        OverlayView: new () => GoogleMapsOverlayView
    }
}

declare global {
    interface Window {
        google?: GoogleMaps
    }
}

export interface ProviderMapProps {
    providers: Array<FeaturedProviderResponse & { latitude?: number; longitude?: number }>
    center?: { lat: number; lng: number }
    zoom?: number
    onMarkerClick?: (provider: FeaturedProviderResponse) => void
    selectedProviderId?: number
    className?: string
}

export const ProviderMap = ({
    providers,
    center,
    zoom = 11,
    onMarkerClick,
    selectedProviderId,
    className = '',
}: ProviderMapProps) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<GoogleMapsMap | null>(null)
    const markersRef = useRef<GoogleMapsOverlayView[]>([])
    const clustererRef = useRef<MarkerClusterer | null>(null)

    // Use external selectedProviderId if provided, otherwise use internal state
    const [internalSelectedProvider, setInternalSelectedProvider] =
        useState<FeaturedProviderResponse | null>(null)

    const selectedProvider = selectedProviderId
        ? providers.find(p => p.id === selectedProviderId) || null
        : internalSelectedProvider

    /* ---------------- CSS (OurBride animation) ---------------- */
    useEffect(() => {
        const style = document.createElement('style')
        style.innerHTML = `
      @keyframes ourbride-bounce {
        0% { transform: rotate(-45deg) translateY(0); }
        30% { transform: rotate(-45deg) translateY(-10px); }
        60% { transform: rotate(-45deg) translateY(0); }
        100% { transform: rotate(-45deg) translateY(0); }
      }
      .marker-bounce { animation: ourbride-bounce .6s ease; }
      .marker-hover {
        transform: rotate(-45deg) scale(1.12);
        box-shadow: 0 10px 22px rgba(252,74,26,.6);
      }
    `
        document.head.appendChild(style)
        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style)
            }
        }
    }, [])

    /* ---------------- Map Init ---------------- */
    useEffect(() => {
        if (!mapRef.current || !window.google?.maps) return

        const map = new window.google.maps.Map(mapRef.current, {
            center: center || { lat: 30.0444, lng: 31.2357 },
            zoom,
            disableDefaultUI: false,
        })

        mapInstanceRef.current = map

        // Clear old markers
        markersRef.current.forEach(m => m.setMap(null))
        markersRef.current = []
        clustererRef.current?.clearMarkers()

        /* ---------------- Custom Overlay Marker ---------------- */
        class CustomMarker extends window.google.maps.OverlayView implements GoogleMapsOverlayView {
            position: GoogleMapsLatLng
            div: HTMLDivElement | null = null
            provider: FeaturedProviderResponse
            private visible: boolean = true

            constructor(position: GoogleMapsLatLng, provider: FeaturedProviderResponse) {
                super()
                this.position = position
                this.provider = provider
            }

            // Required methods for MarkerClusterer compatibility
            getPosition(): GoogleMapsLatLng {
                return this.position
            }

            getVisible(): boolean {
                return this.visible
            }

            setVisible(visible: boolean): void {
                this.visible = visible
                if (this.div) {
                    this.div.style.display = visible ? 'block' : 'none'
                }
            }

            onAdd() {
                this.div = document.createElement('div')

                const rating = this.provider.rate
                const isSelected = selectedProvider?.id === this.provider.id

                this.div.innerHTML = `
          <div style="transform:translate(-50%,-100%);">
            <div class="marker-core" style="
              width:44px;height:44px;
              border-radius:14px 14px 14px 0;
              background:linear-gradient(135deg,#f7b733,#fc4a1a);
              transform:rotate(-45deg);
              display:flex;align-items:center;justify-content:center;
              box-shadow:${isSelected
                        ? '0 8px 20px rgba(252,74,26,.6)'
                        : '0 4px 10px rgba(0,0,0,.25)'};
              transition:.25s;
            ">
              <div style="
                transform:rotate(45deg);
                color:white;font-weight:700;font-size:13px;
                text-shadow:0 1px 2px rgba(0,0,0,.35);
              ">
                ${rating ? rating.toFixed(1) : '★'}
              </div>
            </div>
          </div>
        `

                const core = this.div.querySelector('.marker-core') as HTMLElement

                // Hover
                this.div.addEventListener('mouseenter', () => core.classList.add('marker-hover'))
                this.div.addEventListener('mouseleave', () => core.classList.remove('marker-hover'))

                // Select
                this.div.addEventListener('click', () => {
                    if (onMarkerClick) {
                        onMarkerClick(this.provider)
                    } else {
                        setInternalSelectedProvider(this.provider)
                    }
                    core.classList.remove('marker-bounce')
                    void core.offsetWidth
                    core.classList.add('marker-bounce')
                    map.panTo(this.position)
                    map.panBy(0, -120)
                })

                this.getPanes().overlayLayer.appendChild(this.div)
            }

            draw() {
                if (!this.div) return
                const projection = this.getProjection()
                if (!projection) return
                const point = projection?.fromLatLngToDivPixel(this.position)
                if (!point) return
                this.div.style.left = `${point.x}px`
                this.div.style.top = `${point.y}px`
                this.div.style.position = 'absolute'
                const isSelected = selectedProviderId === this.provider.id || selectedProvider?.id === this.provider.id
                this.div.style.zIndex = isSelected ? '1001' : '1000'
            }

            onRemove() {
                this.div?.remove()
                this.div = null
            }
        }

        /* ---------------- Create Markers ---------------- */
        const overlays: GoogleMapsOverlayView[] = []

        providers.forEach(p => {
            if (typeof p.latitude !== 'number' || typeof p.longitude !== 'number') return
            if (!window.google) return
            const pos = new window.google.maps.LatLng(p.latitude, p.longitude)
            const marker = new CustomMarker(pos, p)
            marker.setMap(map)
            overlays.push(marker)
        })

        markersRef.current = overlays

        /* ---------------- Clusterer (OurBride style) ---------------- */
        try {
            // Custom cluster marker class that extends OverlayView
            if (!window.google) throw new Error('Google Maps API not loaded')
            class ClusterMarker extends window.google.maps.OverlayView implements GoogleMapsOverlayView {
                position: GoogleMapsLatLng
                div: HTMLDivElement | null = null
                count: number
                private visible: boolean = true

                constructor(position: GoogleMapsLatLng, count: number) {
                    super()
                    this.position = position
                    this.count = count
                }

                getPosition(): GoogleMapsLatLng {
                    return this.position
                }

                getVisible(): boolean {
                    return this.visible
                }

                setVisible(visible: boolean): void {
                    this.visible = visible
                    if (this.div) {
                        this.div.style.display = visible ? 'block' : 'none'
                    }
                }

                onAdd() {
                    this.div = document.createElement('div')
                    this.div.innerHTML = `
            <div style="
              width:48px;height:48px;
              border-radius:50%;
              background:linear-gradient(135deg,#f7b733,#fc4a1a);
              display:flex;align-items:center;justify-content:center;
              color:white;font-weight:700;
              box-shadow:0 6px 18px rgba(252,74,26,.55);
              border:3px solid white;
            ">
              ${this.count}
            </div>
          `
                    this.getPanes().overlayLayer.appendChild(this.div)
                }

                draw() {
                    if (!this.div) return
                    const projection = this.getProjection()
                    if (!projection) return
                    const point = projection.fromLatLngToDivPixel(this.position)
                    if (!point) return
                    this.div.style.left = `${point.x}px`
                    this.div.style.top = `${point.y}px`
                    this.div.style.position = 'absolute'
                    this.div.style.transform = 'translate(-50%, -50%)'
                }

                onRemove() {
                    this.div?.remove()
                    this.div = null
                }
            }

            clustererRef.current = new MarkerClusterer({
                map,
                markers: overlays,
                renderer: {
                    render({ count, position }: { count: number; position: GoogleMapsLatLng }) {
                        // Use custom ClusterMarker instead of AdvancedMarkerElement
                        const clusterMarker = new ClusterMarker(position, count)
                        clusterMarker.setMap(map)
                        return clusterMarker
                    },
                },
            })
        } catch (error) {
            console.warn('[ProviderMap] MarkerClusterer initialization failed:', error)
        }

        return () => {
            overlays.forEach(m => m.setMap(null))
            clustererRef.current?.clearMarkers()
        }
    }, [providers, selectedProviderId, selectedProvider])

    /* ---------------- UI ---------------- */
    return (
        <div className={`relative w-full h-full min-h-[500px] ${className}`}>
            <div ref={mapRef} className="absolute inset-0" />
            {/* Provider card is now handled by the parent component */}
        </div>
    )
}
