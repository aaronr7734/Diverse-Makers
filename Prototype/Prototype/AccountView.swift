//
//  AccountView.swift
//  Prototype
//
//  Created by Kane Davidson on 5/7/24.
//

import SwiftUI

struct AccountView: View {
    var body: some View {
        
        List {
            Section {
                NavigationLink( destination: ContentView() ) {
                    Text("My Creations")
                }
                
                NavigationLink( destination: ContentView() ) {
                    Text("Saved Activities")
                }
                
                NavigationLink( destination: ContentView() ) {
                    Text("STEM Learning Outcomes")
                }
                
                NavigationLink( destination: ContentView() ) {
                    Text("Submit an Idea")
                }
                
            } header: { Text("Profile") }
            
            Section {
                NavigationLink( destination: ContentView() ) {
                    Text("Sign Out")
                }
                
                NavigationLink( destination: ContentView() ) {
                    Text("Preferences")
                }
                
                NavigationLink( destination: ContentView() ) {
                    Text("Accessibility")
                }
                
                NavigationLink( destination: ContentView() ) {
                    Text("About")
                }
                
            } header: { Text("Account") }
        }

    }
}

#Preview {
    AccountView()
}
