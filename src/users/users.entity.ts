import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: true })
    email: string; // Nullable for Google users

    @Column({ nullable: true })
    password: string; // Nullable for Google users

    @Column({ default: false })
    isVerified: boolean;

    @Column({ type: 'varchar', length: 6, nullable: true }) // Adjust length if needed
    verificationCode: string | null;

    @Column({ type: 'timestamp', nullable: true })
    verificationCodeExpiresAt: Date | null;    

    @Column({ unique: true, nullable: true })
    googleId: string; // Stores Google OAuth ID

    @Column({ nullable: true })
    name: string; // Stores user's name from Google

    @Column({ nullable: true })
    profilePicture: string; // Stores profile image URL from Google
}
