//
//  Map.swift
//  Prototype
//
//  Created by Kane Davidson on 5/7/24.
//

import SwiftUI
import MapKit
import CoreLocation

struct MapView: View {
    
    let locationManager = CLLocationManager()
    
    @State var region = MKCoordinateRegion(
        center: .init(latitude: 35.198284,longitude: -111.651299),
        span: .init(latitudeDelta: 0.2, longitudeDelta: 0.2)
    )

    var body: some View {
        Map(coordinateRegion: $region, showsUserLocation: true, userTrackingMode: .constant(.follow))
            //.edgesIgnoringSafeArea(.all)
            .onAppear {
                locationManager.requestWhenInUseAuthorization()
            }
    }
}

#Preview {
    MapView()
}
