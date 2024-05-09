//
//  ProjectDescription.swift
//  Prototype
//
//  Created by Kane Davidson on 5/7/24.
//

import SwiftUI

struct ProjectDescription: View {
    var body: some View {
        VStack {
            Image("pic1")
                .resizable(resizingMode: .stretch)
                .aspectRatio(contentMode: .fit)
                .padding()
            
            HStack {
                Text("Summary")
                    .fontWeight(.bold)
                Spacer()
            } .padding()
            
            Text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Senectus et netus et malesuada fames. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Ornare arcu odio ut sem nulla pharetra. ") .padding()
            Spacer()
            
            List {
                NavigationLink( destination: ContentView()) { Text("Prerequisites" )}
                NavigationLink( destination: ContentView()) { Text("Related Projects" )}
                NavigationLink( destination: ContentView()) { Text("STEM Challenges" )}
            } 
        }
    }
}

#Preview {
    ProjectDescription()
}
